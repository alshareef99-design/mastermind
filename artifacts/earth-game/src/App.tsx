import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import FlagQuiz from "@/pages/FlagQuiz";
import CapitalQuiz from "@/pages/CapitalQuiz";
import MapQuiz from "@/pages/MapQuiz";
import ShapeQuiz from "@/pages/ShapeQuiz";
import FlashCards from "@/pages/FlashCards";
import Leaderboard from "@/pages/Leaderboard";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/flag-quiz" component={FlagQuiz} />
      <Route path="/capital-quiz" component={CapitalQuiz} />
      <Route path="/map-quiz" component={MapQuiz} />
      <Route path="/shape-quiz" component={ShapeQuiz} />
      <Route path="/flash-cards" component={FlashCards} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
