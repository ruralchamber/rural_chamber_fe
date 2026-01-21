// types/economic-zone/economic-zone.types.ts

export interface InvestorReadinessAssessment {
  id?: number;
  userId: number;
  businessName: string;
  industry: string;
  annualRevenue?: number;
  yearsInOperation: number;
  hasFinancialStatements: boolean;
  hasFormalizedStructure: boolean;
  seekingInvestmentAmount?: number;
  useOfFunds?: string;
  currentChallenges?: string;
  growthPlan?: string;
  readinessScore?: number;
  status: 'pending' | 'completed' | 'approved' | 'needs_improvement';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MentorshipRequest {
  id?: number;
  userId: number;
  businessName: string;
  industry: string;
  specificChallenges: string;
  desiredOutcomes: string;
  preferredMentorExpertise: string[];
  availabilitySchedule: string;
  status: 'pending' | 'matched' | 'active' | 'completed';
  matchedMentorId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BusinessGrowthAssessment {
  id?: number;
  userId: number;
  businessName: string;
  currentEmployees: number;
  targetEmployees: number;
  currentRevenue: number;
  targetRevenue: number;
  growthTimeframe: string;
  mainObstacles: string[];
  resourcesNeeded: string[];
  hasGrowthStrategy: boolean;
  marketingCapabilities: string;
  operationalCapabilities: string;
  financialCapabilities: string;
  assessmentScore?: number;
  recommendations?: string[];
  status: 'pending' | 'completed' | 'in_progress';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FundingReadinessAssessment {
  id?: number;
  userId: number;
  businessName: string;
  fundingAmount: number;
  fundingPurpose: string;
  fundingType: 'grant' | 'loan' | 'equity' | 'debt';
  hasBusinessPlan: boolean;
  hasFinancialProjections: boolean;
  hasCreditHistory: boolean;
  creditScore?: number;
  collateralAvailable: boolean;
  collateralValue?: number;
  currentDebt?: number;
  monthlyRevenue?: number;
  profitMargin?: number;
  readinessScore?: number;
  recommendations?: string[];
  status: 'pending' | 'completed' | 'approved' | 'declined';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MemberOpportunity {
  id: number;
  title: string;
  description: string;
  industry: string[];
  opportunityType: 'tender' | 'partnership' | 'contract' | 'collaboration' | 'supplier';
  location?: string;
  deadline?: Date;
  requirements?: string[];
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  status: 'open' | 'closing_soon' | 'closed';
  postedBy?: string;
  postedAt: Date;
  expiresAt?: Date;
}

export interface BusinessTrip {
  id: number;
  title: string;
  destination: string;
  country: string;
  startDate: Date;
  endDate: Date;
  description: string;
  itinerary?: string[];
  inclusions: string[];
  exclusions?: string[];
  regularPrice: number;
  memberPrice: number;
  discount: number;
  availableSlots: number;
  bookedSlots: number;
  imageUrl?: string;
  status: 'upcoming' | 'booking_open' | 'full' | 'completed' | 'cancelled';
  organizer?: string;
}

export interface InvestmentOpportunity {
  id: number;
  title: string;
  description: string;
  industry: string;
  investmentType: 'equity' | 'debt' | 'hybrid' | 'property' | 'project';
  minimumInvestment: number;
  maximumInvestment?: number;
  targetAmount: number;
  raisedAmount: number;
  expectedReturn: string;
  investmentPeriod: string;
  riskLevel: 'low' | 'medium' | 'high';
  status: 'open' | 'current' | 'closed' | 'funded';
  documents?: string[];
  contactPerson?: string;
  deadline?: Date;
  postedAt: Date;
}

export interface MemberBusiness {
  id: number;
  userId: number;
  businessName: string;
  industry: string;
  sector: string;
  description: string;
  productsServices: string[];
  location: string;
  province: string;
  contactPerson: string;
  email: string;
  phone: string;
  website?: string;
  logo?: string;
  yearsInOperation: number;
  employeeCount: string;
  seekingClients: boolean;
  seekingPartners: boolean;
  certifications?: string[];
  tags?: string[];
  membershipType: string;
  joinedAt: Date;
}

export interface EventTicket {
  id: number;
  eventId: number;
  ticketType: string;
  description?: string;
  price: number;
  memberPrice?: number;
  availableQuantity: number;
  soldQuantity: number;
  maxPerOrder?: number;
}

export interface EventBooking {
  id?: number;
  userId: number;
  eventId: number;
  tickets: {
    ticketId: number;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  discountApplied: number;
  finalAmount: number;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentReference?: string;
  bookingDate: Date;
  status: 'confirmed' | 'cancelled' | 'pending';
}

export interface EventCreationRequest {
  id?: number;
  userId: number;
  eventName: string;
  eventType: string;
  expectedAttendees: number;
  eventDate?: Date;
  location?: string;
  description: string;
  budget?: number;
  needsVenue: boolean;
  needsCatering: boolean;
  needsMarketing: boolean;
  needsSponsorships: boolean;
  additionalRequirements?: string;
  contactPreference: 'phone' | 'email' | 'whatsapp';
  status: 'pending' | 'contacted' | 'in_planning' | 'confirmed' | 'completed';
  createdAt: Date;
}