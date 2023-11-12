export interface FactoryProps {
  nameAR: string;
  nameEN: string;
  typeAR: string;
  typeEN: string;
  descriptionAR: string;
  descriptionEN: string;
  phone: string;
  email: string;
  images: string[];
  _id: string;
  createdAt: string;
}

export interface MemberProps {
  _id: string;
  nameAR: string;
  nameEN: string;
  image: string;
  role: string;
  createdAt: string;
}

export interface EventProps {
  _id: string;
  titleAR: string;
  descriptionAR: string;
  titleEN: string;
  descriptionEN: string;
  date: string;
  image: string;
  type: string;
  createdAt: string;
}

export interface ComplaintProps {
  _id: string;
  name: string;
  email: string;
  company: string;
  job: string;
  companyEmail: string;
  companyPhone: string;
  phone: string;
  whats: string;
  message: string;
  createdAt: string;
}

export interface MessageProps {
  _id: string;
  name: string;
  email: string;
  reason: string;
  phone: string;
  message: string;
  createdAt: string;
}
