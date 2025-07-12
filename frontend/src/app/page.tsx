import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Trophy, Users, TrendingUp, UserCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <section className="pt-20 pb-5 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white mb-4">
              <span className="text-purple-600 dark:text-purple-400">⚡</span>{' '}
              Clash of fanZ
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mt-6"></div>
          </div>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Join the ultimate sports betting experience. Place your bets, earn
            achievements, and connect with the community.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            Everything You Need to Win
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 text-center mb-16">
            Experience the future of sports betting with our comprehensive
            platform
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link href="/live-bets">
              <Card className="hover:shadow-xl transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-2xl">Live Betting</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-6">
                    Real-time betting on your favorite sports with live odds and
                    instant payouts.
                  </CardDescription>
                  <div className="flex items-center text-purple-600 dark:text-purple-400 font-semibold">
                    Place Bets Now
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/achievements">
              <Card className="hover:shadow-xl transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mb-4">
                    <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <CardTitle className="text-2xl">NFT Rewards</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-6">
                    Unlock exclusive NFT trophies and achievements for your
                    betting success.
                  </CardDescription>
                  <div className="flex items-center text-yellow-600 dark:text-yellow-400 font-semibold">
                    View Trophies
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/community">
              <Card className="hover:shadow-xl transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-2xl">Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-6">
                    Connect with fellow bettors and earn POAP badges for
                    community participation.
                  </CardDescription>
                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold">
                    Join Community
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/profile">
              <Card className="hover:shadow-xl transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center mb-4">
                    <UserCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <CardTitle className="text-2xl">My Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-6">
                    Manage your information, track your performance and unlock
                    exclusive levels.
                  </CardDescription>
                  <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-semibold">
                    View My Profile
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
