import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PricingPanel = ({ selectedCompanySize }) => {
  const pricingPlans = {
    '1-10': {
      name: 'Startup Plan',
      price: '$29',
      period: 'per month',
      description: 'Perfect for small teams getting started',
      features: [
        'Up to 10 employees',
        'Basic attendance tracking',
        'Task management',
        'Email support',
        'Mobile app access',
        'Basic reporting'
      ],
      popular: false,
      color: 'border-primary'
    },
    '11-50': {
      name: 'Small Business',
      price: '$79',
      period: 'per month',
      description: 'Ideal for growing small companies',
      features: [
        'Up to 50 employees',
        'Advanced time tracking',
        'Leave management',
        'Basic payroll',
        'Priority support',
        'Custom reports',
        'API access'
      ],
      popular: true,
      color: 'border-success'
    },
    '51-200': {
      name: 'Professional',
      price: '$199',
      period: 'per month',
      description: 'Great for expanding organizations',
      features: [
        'Up to 200 employees',
        'Screen monitoring',
        'Advanced payroll',
        'Multi-branch support',
        'Phone support',
        'Advanced analytics',
        'Custom integrations',
        'Bulk operations'
      ],
      popular: false,
      color: 'border-warning'
    },
    '201-1000': {
      name: 'Enterprise',
      price: '$499',
      period: 'per month',
      description: 'Comprehensive features for large teams',
      features: [
        'Up to 1000 employees',
        'Full monitoring suite',
        'Advanced payroll & tax',
        'Multi-location support',
        'Dedicated support',
        'Custom dashboards',
        'White-label options',
        'Advanced security'
      ],
      popular: false,
      color: 'border-accent'
    },
    '1000+': {
      name: 'Enterprise Plus',
      price: 'Custom',
      period: 'pricing',
      description: 'Full enterprise-grade capabilities',
      features: [
        'Unlimited employees',
        'Complete feature set',
        'Custom development',
        'On-premise deployment',
        '24/7 dedicated support',
        'Custom integrations',
        'Advanced compliance',
        'Training & onboarding'
      ],
      popular: false,
      color: 'border-primary'
    }
  };

  const currentPlan = pricingPlans?.[selectedCompanySize] || pricingPlans?.['1-10'];

  return (
    <div className="bg-card border border-border rounded-lg p-6 sticky top-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Your Selected Plan</h3>
        <p className="text-sm text-muted-foreground">
          Based on your company size selection
        </p>
      </div>
      <div className={`border-2 ${currentPlan?.color} rounded-lg p-6 relative`}>
        {currentPlan?.popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-success text-success-foreground text-xs font-semibold px-3 py-1 rounded-full">
              Most Popular
            </span>
          </div>
        )}

        <div className="text-center mb-6">
          <h4 className="text-xl font-bold text-foreground mb-1">{currentPlan?.name}</h4>
          <div className="flex items-baseline justify-center space-x-1 mb-2">
            <span className="text-3xl font-bold text-foreground">{currentPlan?.price}</span>
            <span className="text-sm text-muted-foreground">{currentPlan?.period}</span>
          </div>
          <p className="text-sm text-muted-foreground">{currentPlan?.description}</p>
        </div>

        <div className="space-y-3 mb-6">
          <h5 className="text-sm font-semibold text-foreground">What's included:</h5>
          <ul className="space-y-2">
            {currentPlan?.features?.map((feature, index) => (
              <li key={index} className="flex items-start space-x-2">
                <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <Button variant="outline" fullWidth>
            View All Plans
          </Button>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              30-day free trial • No credit card required
            </p>
          </div>
        </div>
      </div>
      {/* Additional Information */}
      <div className="mt-6 space-y-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Shield" size={16} className="text-primary mt-0.5" />
            <div>
              <h5 className="text-sm font-medium text-foreground mb-1">Security & Compliance</h5>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• SOC 2 Type II certified</li>
                <li>• GDPR & CCPA compliant</li>
                <li>• 256-bit SSL encryption</li>
                <li>• Regular security audits</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Headphones" size={16} className="text-primary mt-0.5" />
            <div>
              <h5 className="text-sm font-medium text-foreground mb-1">Support & Training</h5>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Free onboarding session</li>
                <li>• Video tutorials library</li>
                <li>• Knowledge base access</li>
                <li>• Community forum</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Questions about pricing?{' '}
            <button className="text-primary hover:text-primary/80 font-medium">
              Contact Sales
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPanel;