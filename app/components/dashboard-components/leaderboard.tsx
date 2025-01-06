"use client";
import { Card, CardHeader, CardDescription } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Projects from "./projects";
import Rowcards from "./rowcards";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { useEffect } from "react";
import useLeaderboardStore from "@/app/useLeaderboardStore";

export type TUserData = {
  fullName: string;
  username: string;
  bounty: number;
  accountActive: boolean;
  _count: { Solution: string };
};
const Leaderboard = () => {
  const { User, setUser } = useLeaderboardStore();
  const getLeaderboardData = async () => {
    try {
      const request = await fetch("/api/leaderboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (request.status !== 200) {
        console.log("Error fetching leaderboard data", request.status);
      }

      const data = await request.json();
      data.leaderboard.forEach((userData: TUserData, index: number) => {
        const rank = index + 1;
        setUser(
          userData.fullName,
          userData.username,
          rank,
          userData.bounty,
          userData.accountActive,
          userData._count
        ); // Save rank to Zustand
      });
    } catch (error) {
      console.log("Error fetching leaderboard data", error);
    }
  };
  useEffect(() => {
    getLeaderboardData();
  }, []);

  return (
    <Card className="bg-transparent border-none p-6 relative rounded-none z-50 w-full max-h-screen overflow-y-auto pb-10">
      <Tabs defaultValue="leaderboard" className="w-full">
        <TabsList className="grid grid-cols-2 bg-[#1d1e3a] text-base text-white h-10 w-full">
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard">
          <CardHeader className="font-bold text-4xl sm:text-6xl pt-4 pb-2 px-4 text-[#3abef9]">
            Leaderboard
          </CardHeader>
          <CardDescription className="px-4 pb-4 text-[#c8c7cc]">
            Leaderboard refreshes every 1 hour.
          </CardDescription>

          <div className="flex bg-[#1d1b2e] mx-2 p-4 text-white sm:font-semibold rounded-lg">
            <div className="text-sm sm:text-base w-[10%] text-left">Rank</div>
            <div className="text-sm sm:text-base w-[70%] text-left pl-16">
              Name
            </div>
            <div className="text-sm sm:text-base w-[20%] text-center hidden md:block">
              PR Merged
            </div>
            <div className="text-sm sm:text-base w-[20%] text-right">
              Bounties
            </div>
          </div>

          <ScrollArea className="max-h-[75vh] overflow-y-auto overflow-x-auto relative">
            {Object.keys(User).length === 0 ? (
              <div className="text-center text-2xl text-[#c8c7cc] p-4">
                Loading Leaderboard...
              </div>
            ) : (
              Object.entries(User).map(([username, data]) => (
                <Rowcards
                  key={data.rank}
                  index={data.rank}
                  avatar_url={`https://github.com/${username}.png`}
                  fullName={data.fullName}
                  username={username}
                  PRmerged={parseInt(data._count.Solution)}
                  bounty={data.bounty}
                />
              ))
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="projects">
          <Projects />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default Leaderboard;
