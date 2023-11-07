export interface AuthDto {
    id: number;
    username: string;
    email: string;
    hash: string;
    profile: UserProfile | null;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface UserProfile {
    // Define the structure of the UserProfile here if needed
  }
  