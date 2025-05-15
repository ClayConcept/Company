import React from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { Check } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { SubscriptionTier } from '../../types';

interface PricingCardProps {
  title: string;
  price: number;
  description: string;
  features: string[];
  tier: SubscriptionTier;
  popular?: boolean;
  onSelect: (tier: SubscriptionTier) => void;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  description,
  features,
  tier,
  popular = false,
  onSelect,
}) => {
  const { user } = useAuthStore();
  const isCurrentPlan = user?.subscription === tier;
  
  return (
    <Card
      className={`transition-all ${popular ? 'transform hover:-translate-y-2' : 'hover:-translate-y-1'}`}
      hoverable
    >
      {popular && (
        <div className="bg-black text-white py-1 px-3 text-xs font-bold uppercase text-center">
          Most Popular
        </div>
      )}
      
      <div className="p-6">
        <h3 className="text-xl font-bold uppercase mb-1">{title}</h3>
        <div className="mb-4">
          <span className="text-3xl font-bold">${price}</span>
          <span className="text-sm text-gray-500">/month</span>
        </div>
        
        <p className="text-sm mb-6">{description}</p>
        
        <div className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <Check size={18} className="text-black mr-2 shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
        
        <Button
          fullWidth
          variant={isCurrentPlan ? 'secondary' : 'primary'}
          onClick={() => onSelect(tier)}
          disabled={isCurrentPlan}
        >
          {isCurrentPlan ? 'Current Plan' : 'Select Plan'}
        </Button>
      </div>
    </Card>
  );
};

export default PricingCard;