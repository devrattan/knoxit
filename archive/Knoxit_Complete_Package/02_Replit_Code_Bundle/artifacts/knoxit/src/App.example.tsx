// artifacts/knoxit/src/App.tsx (EXAMPLE — merge into your existing App.tsx,
// don't blindly overwrite it if you already have routes for Fixtures,
// Leaderboard, Profile, etc. set up)

import { Switch, Route } from "wouter";
import Home from "./pages/Home";
import MyLeagues from "./pages/MyLeagues";
import Picks from "./pages/Picks";
import PickSubmission from "./pages/PickSubmission";
import Fixtures from "./pages/Fixtures";
import Shop from "./pages/Shop";
import Profile from "./pages/menu/Profile";
import NotificationSettings from "./pages/menu/NotificationSettings";
import ReferAndEarn from "./pages/menu/ReferAndEarn";
import InviteFriends from "./pages/menu/InviteFriends";
import SignOut from "./pages/menu/SignOut";
import { HowToPlay, FAQ, TermsAndConditions, PrivacyPolicy, ContactSupport, About } from "./pages/menu/StaticPages";
import LeagueDetail from "./pages/LeagueDetail";
import OpponentProfile from "./pages/OpponentProfile";
import ExploreLeagues from "./pages/ExploreLeagues";
import { PublicFriendsLeaguesList, FriendsLeagueRequestDetail } from "./pages/FriendsLeagues";
import JoinByCode from "./pages/JoinByCode";
import CreateFriendsLeague from "./pages/CreateFriendsLeague";
import ManageAdmins from "./pages/ManageAdmins";
import ManageRequests from "./pages/ManageRequests";

// Mobile-first container per replit.md: max-width 430px centered, phone
// frame on desktop. Adjust this to match whatever Layout component you
// already have — this is just the shape these pages expect to sit inside.
function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-[430px] min-h-screen md:min-h-[820px] md:my-6 md:rounded-[2rem] md:border md:border-white/10 overflow-hidden bg-zinc-950 flex flex-col">
        {children}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppShell>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/my-leagues" component={MyLeagues} />
        <Route path="/picks" component={Picks} />
        <Route path="/picks/submit/:leagueId" component={PickSubmission} />
        <Route path="/fixtures" component={Fixtures} />
        <Route path="/shop" component={Shop} />
        <Route path="/menu/profile" component={Profile} />
        <Route path="/menu/notifications" component={NotificationSettings} />
        <Route path="/menu/refer" component={ReferAndEarn} />
        <Route path="/menu/invite" component={InviteFriends} />
        <Route path="/menu/sign-out" component={SignOut} />
        <Route path="/menu/how-to-play" component={HowToPlay} />
        <Route path="/menu/faq" component={FAQ} />
        <Route path="/menu/terms" component={TermsAndConditions} />
        <Route path="/menu/privacy" component={PrivacyPolicy} />
        <Route path="/menu/support" component={ContactSupport} />
        <Route path="/menu/about" component={About} />
        <Route path="/leagues/explore" component={ExploreLeagues} />
        <Route path="/leagues/:id" component={LeagueDetail} />
        <Route path="/leagues/:leagueId/opponent/:userId" component={OpponentProfile} />
        <Route path="/friends-leagues" component={PublicFriendsLeaguesList} />
        <Route path="/friends-leagues/requests" component={ManageRequests} />
        <Route path="/friends-leagues/join-by-code" component={JoinByCode} />
        <Route path="/friends-leagues/create" component={CreateFriendsLeague} />
        <Route path="/leagues/:id/manage-admins" component={ManageAdmins} />
        <Route path="/friends-leagues/:id" component={FriendsLeagueRequestDetail} />
        {/* Your existing routes for /picks, /fixtures, /shop, /leaderboard go here too */}
      </Switch>
    </AppShell>
  );
}
