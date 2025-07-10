export interface Movie {
  _id: string;
  name: string;
  slug:string;
  category: string;
  duration_min: string;
  language: string;
  description: string;
  posterURL: {
    sm: string;
    lg: string;
  };
  status: string;
  trailerURL: string;
  releaseDate: string;
}

export interface MovieSectionProps {
  variant: "showing" | "upcoming";
}
