export interface Domain {
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
  isDefault: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDomainInput {
  name: string;
  color: string;
  icon?: string;
  description?: string;
}

export interface UpdateDomainInput {
  name?: string;
  color?: string;
  icon?: string;
  description?: string;
  order?: number;
}
