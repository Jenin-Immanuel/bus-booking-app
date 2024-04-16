import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
export default function Landing() {
  return (
    <>
      <div>
        <h1>Welcome to BusLinker</h1>
        <Button>
          <Link to={"/login"}>Login</Link>
        </Button>
      </div>
    </>
  );
}
