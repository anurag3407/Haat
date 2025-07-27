import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import toast from 'react-hot-toast';

const PageContainer = styled(motion.div)`
  min-height: calc(100vh - 80px);
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.gradients.primary};
`;

const PageContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSize['4xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const PageSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSize.xl};
  color: ${({ theme }) => theme.colors.textLight};
  max-width: 600px;
  margin: 0 auto;
`;

const FormCard = styled(motion.div)`
  background: ${({ theme }) => theme.gradients.card};
  padding: ${({ theme }) => theme.spacing['2xl']};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.large};
  border: 1px solid ${({ theme }) => theme.colors.primary};
`;

const FormStep = styled.div`
  display: ${({ active }) => (active ? 'block' : 'none')};
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  gap: ${({ theme }) => theme.spacing.md};
`;

const Step = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ active, theme }) => 
    active ? theme.gradients.secondary : 'rgba(220, 198, 160, 0.3)'};
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  transition: ${({ theme }) => theme.transitions.normal};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSize.md};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background: rgba(255, 255, 255, 0.7);
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSize.md};
  font-family: inherit;
  transition: ${({ theme }) => theme.transitions.normal};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px rgba(220, 198, 160, 0.3);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background: rgba(255, 255, 255, 0.7);
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSize.md};
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: ${({ theme }) => theme.transitions.normal};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px rgba(220, 198, 160, 0.3);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background: rgba(255, 255, 255, 0.7);
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSize.md};
  font-family: inherit;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.normal};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 3px rgba(220, 198, 160, 0.3);
  }
`;

const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.normal};

  &:hover {
    background: rgba(255, 255, 255, 0.7);
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: ${({ theme }) => theme.colors.accent};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing['2xl']};
`;

const Button = styled.button`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing['2xl']};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.md};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.normal};
  font-family: inherit;
  min-width: 120px;

  ${({ variant, theme }) => {
    if (variant === 'secondary') {
      return `
        background: rgba(255, 255, 255, 0.5);
        color: ${theme.colors.text};
        border: 2px solid ${theme.colors.primary};
        
        &:hover {
          background: rgba(255, 255, 255, 0.7);
        }
      `;
    }
    return `
      background: ${theme.gradients.secondary};
      color: ${theme.colors.text};
      border: none;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: ${theme.shadows.medium};
      }
    `;
  }}
`;

const OrderSummary = styled.div`
  background: rgba(255, 255, 255, 0.3);
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const SummaryTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.fontSize.xl};
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textLight};
`;

const NewOrder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState({
    category: '',
    productName: '',
    description: '',
    quantity: '',
    unit: '',
    urgency: 'normal',
    deliveryLocation: '',
    maxBudget: '',
    preferredSuppliers: [],
    additionalRequirements: ''
  });

  const categories = [
    'Grains & Cereals',
    'Vegetables',
    'Fruits',
    'Dairy Products',
    'Spices & Seasonings',
    'Cooking Oil',
    'Packaging Materials',
    'Beverages',
    'Snacks & Confectionery',
    'Other'
  ];

  const suppliers = [
    'Fresh Farm Co.',
    'Spice World',
    'Grain Masters',
    'Green Valley Supplies',
    'City Food Distribution',
    'Premium Packaging'
  ];

  const handleInputChange = (field, value) => {
    setOrderData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSupplierToggle = (supplier) => {
    setOrderData(prev => ({
      ...prev,
      preferredSuppliers: prev.preferredSuppliers.includes(supplier)
        ? prev.preferredSuppliers.filter(s => s !== supplier)
        : [...prev.preferredSuppliers, supplier]
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      console.log('Submitting order:', orderData);
      
      const response = await ordersAPI.createOrder(orderData);
      
      if (response && response.message) {
        toast.success('Order created successfully!');
        console.log('Order created:', response.order);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(error.message || 'Failed to create order');
    }
  };

  return (
    <PageContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <PageContent>
        <PageHeader>
          <PageTitle>Create New Order</PageTitle>
          <PageSubtitle>
            Get competitive quotes from multiple suppliers for your business needs
          </PageSubtitle>
        </PageHeader>

        <FormCard
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <StepIndicator>
            {[1, 2, 3].map(step => (
              <Step key={step} active={step <= currentStep}>
                {step}
              </Step>
            ))}
          </StepIndicator>

          <FormStep active={currentStep === 1}>
            <FormGroup>
              <Label>Product Category *</Label>
              <Select
                value={orderData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Product Name *</Label>
              <Input
                type="text"
                placeholder="e.g., Basmati Rice, Fresh Tomatoes"
                value={orderData.productName}
                onChange={(e) => handleInputChange('productName', e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Description</Label>
              <TextArea
                placeholder="Describe your specific requirements, quality expectations, etc."
                value={orderData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </FormGroup>
          </FormStep>

          <FormStep active={currentStep === 2}>
            <FormGroup>
              <Label>Quantity *</Label>
              <Input
                type="number"
                placeholder="e.g., 50"
                value={orderData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Unit *</Label>
              <Select
                value={orderData.unit}
                onChange={(e) => handleInputChange('unit', e.target.value)}
              >
                <option value="">Select unit</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="lbs">Pounds (lbs)</option>
                <option value="pieces">Pieces</option>
                <option value="boxes">Boxes</option>
                <option value="liters">Liters</option>
                <option value="tons">Tons</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Urgency Level</Label>
              <Select
                value={orderData.urgency}
                onChange={(e) => handleInputChange('urgency', e.target.value)}
              >
                <option value="normal">Normal (3-5 days)</option>
                <option value="urgent">Urgent (1-2 days)</option>
                <option value="asap">ASAP (Same day)</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Delivery Location *</Label>
              <Input
                type="text"
                placeholder="Enter your delivery address"
                value={orderData.deliveryLocation}
                onChange={(e) => handleInputChange('deliveryLocation', e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Maximum Budget (₹)</Label>
              <Input
                type="number"
                placeholder="Your maximum budget for this order"
                value={orderData.maxBudget}
                onChange={(e) => handleInputChange('maxBudget', e.target.value)}
              />
            </FormGroup>
          </FormStep>

          <FormStep active={currentStep === 3}>
            <FormGroup>
              <Label>Preferred Suppliers (Optional)</Label>
              <CheckboxGroup>
                {suppliers.map(supplier => (
                  <CheckboxItem key={supplier}>
                    <Checkbox
                      type="checkbox"
                      checked={orderData.preferredSuppliers.includes(supplier)}
                      onChange={() => handleSupplierToggle(supplier)}
                    />
                    {supplier}
                  </CheckboxItem>
                ))}
              </CheckboxGroup>
            </FormGroup>

            <FormGroup>
              <Label>Additional Requirements</Label>
              <TextArea
                placeholder="Any special requirements, certifications needed, delivery preferences, etc."
                value={orderData.additionalRequirements}
                onChange={(e) => handleInputChange('additionalRequirements', e.target.value)}
              />
            </FormGroup>

            <OrderSummary>
              <SummaryTitle>Order Summary</SummaryTitle>
              <SummaryItem>
                <span>Product:</span>
                <span>{orderData.productName || 'Not specified'}</span>
              </SummaryItem>
              <SummaryItem>
                <span>Category:</span>
                <span>{orderData.category || 'Not specified'}</span>
              </SummaryItem>
              <SummaryItem>
                <span>Quantity:</span>
                <span>{orderData.quantity ? `${orderData.quantity} ${orderData.unit}` : 'Not specified'}</span>
              </SummaryItem>
              <SummaryItem>
                <span>Urgency:</span>
                <span>{orderData.urgency}</span>
              </SummaryItem>
              <SummaryItem>
                <span>Max Budget:</span>
                <span>{orderData.maxBudget ? `₹${orderData.maxBudget}` : 'Not specified'}</span>
              </SummaryItem>
            </OrderSummary>
          </FormStep>

          <ButtonGroup>
            {currentStep > 1 && (
              <Button variant="secondary" onClick={handlePrevious}>
                Previous
              </Button>
            )}
            {currentStep < 3 ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button onClick={handleSubmit}>Submit Order</Button>
            )}
          </ButtonGroup>
        </FormCard>
      </PageContent>
    </PageContainer>
  );
};

export default NewOrder;
