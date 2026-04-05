export interface ProfileFact {
  id: string;
  value: string;
}

export interface ProfileData {
  facts: ProfileFact[];
  email?: string;
  website?: string;
  social?: {
    github?: string;
    orcid?: string;
    googlescholar?: string;
    csdn?: string;
  };
}

export interface ResolvedProfileData extends ProfileData {
  name: string;
  location: string;
  organization: string;
}