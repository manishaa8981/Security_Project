import { useNavigate } from "react-router-dom";
import { Button } from "@/components/shadcn/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/shadcn/card"; 

interface IErrorFallbackProps {
  resetErrorBoundary: (...args: unknown[]) => void;
}

const ErrorFallback = ({ resetErrorBoundary }: IErrorFallbackProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-destructive">
            Oops! Something went wrong.
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            We encountered an error. Please try again or go back to the home
            page.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center gap-4">
          <Button variant="destructive" onClick={() => resetErrorBoundary()}>
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              navigate("/", { replace: true });
              window.location.reload();
            }}
          >
            Go Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ErrorFallback;
