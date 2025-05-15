import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { SubscriptionTier } from '../../types';
import PricingCard from './PricingCard';
import Button from '../ui/Button';
import Card from '../ui/Card';

const SubscriptionForm: React.FC = () => {
  const { user, updateSubscription } = useAuthStore();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);
  
  const plans = [
    {
      title: 'Free',
      price: 0,
      tier: 'free' as SubscriptionTier,
      description: 'Basic plan for small projects',
      features: [
        '5 tokens per month',
        'Basic AI project assistance',
        'Access to Kanban board',
        'Manual calendar management',
      ],
    },
    {
      title: 'Starter',
      price: 9.99,
      tier: 'starter' as SubscriptionTier,
      description: 'For freelancers and individuals',
      features: [
        '20 tokens per month',
        'Advanced AI project assistance',
        'Full calendar features',
        'Priority support',
        '1 free task per day',
      ],
      popular: true,
    },
    {
      title: 'Professional',
      price: 19.99,
      tier: 'professional' as SubscriptionTier,
      description: 'For design professionals',
      features: [
        '50 tokens per month',
        'Premium AI project assistance',
        'Advanced project analytics',
        'Custom task groups',
        'Multiple free tasks',
        'Priority support',
      ],
    },
    {
      title: 'Enterprise',
      price: 49.99,
      tier: 'enterprise' as SubscriptionTier,
      description: 'For teams and agencies',
      features: [
        'Unlimited tokens',
        'Team collaboration features',
        'Multiple projects',
        'Custom integrations',
        'White-label option',
        'Dedicated support',
      ],
    },
  ];
  
  const handleSelectPlan = (tier: SubscriptionTier) => {
    setSelectedTier(tier);
    setShowConfirmation(true);
  };
  
  const confirmSubscription = () => {
    if (selectedTier) {
      updateSubscription(selectedTier);
      setShowConfirmation(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold uppercase mb-2">Membership Plans</h2>
        <p className="text-lg max-w-2xl mx-auto">
          Choose the plan that fits your design needs. All plans include access to our AI-powered project management tools.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {plans.map((plan) => (
          <PricingCard
            key={plan.tier}
            title={plan.title}
            price={plan.price}
            description={plan.description}
            features={plan.features}
            tier={plan.tier}
            popular={plan.popular}
            onSelect={handleSelectPlan}
          />
        ))}
      </div>
      
      <div className="max-w-3xl mx-auto">
        <Card className="p-6">
          <h3 className="text-xl font-bold uppercase mb-2">Current Subscription</h3>
          <p className="mb-4">
            You are currently on the <strong className="uppercase">{user?.subscription || 'Free'}</strong> plan.
          </p>
          
          <div className="p-4 bg-gray-100 border border-black mb-4">
            <h4 className="font-bold mb-2">Important Information</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>You can change your plan at any time</li>
              <li>Downgrading takes effect at the end of your billing cycle</li>
              <li>Upgrading applies immediately with prorated charges</li>
              <li>Tokens do not roll over to the next month</li>
            </ul>
          </div>
          
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => window.open('https://stripe.com', '_blank')}
            >
              Manage Payment <ExternalLink size={14} className="ml-1" />
            </Button>
            
            {user?.subscription && user.subscription !== 'free' && (
              <Button
                variant="danger"
                onClick={() => handleSelectPlan('free')}
              >
                Cancel Subscription
              </Button>
            )}
          </div>
        </Card>
      </div>
      
      {/* Confirmation Modal */}
      {showConfirmation && selectedTier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-xl font-bold uppercase mb-4">Confirm Subscription Change</h3>
            
            <p className="mb-4">
              Are you sure you want to {selectedTier === 'free' && user?.subscription !== 'free' ? 'cancel your subscription' : `switch to the ${selectedTier} plan`}?
            </p>
            
            {selectedTier === 'free' && user?.subscription !== 'free' ? (
              <p className="text-sm text-gray-600 mb-6">
                Your subscription will be canceled at the end of your current billing period. You'll still have access to your current features until then.
              </p>
            ) : (
              <p className="text-sm text-gray-600 mb-6">
                {user?.subscription === 'free' 
                  ? "You'll be charged immediately for the new subscription."
                  : "Your subscription will be updated immediately and you'll be charged or credited the prorated amount."}
              </p>
            )}
            
            <div className="flex space-x-4 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </Button>
              <Button
                variant={selectedTier === 'free' && user?.subscription !== 'free' ? 'danger' : 'primary'}
                onClick={confirmSubscription}
              >
                Confirm
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SubscriptionForm;