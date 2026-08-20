import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  ideasAPI,
  savedIdeasAPI,
  interestAPI,
  investorAPI,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import type { Idea } from "../types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { MapPin, DollarSign, Bookmark, Send, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const IdeaDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [interestMessage, setInterestMessage] = useState("");
  const [showInterestDialog, setShowInterestDialog] = useState(false);
  const [submittingInterest, setSubmittingInterest] = useState(false);

  useEffect(() => {
    if (id) {
      loadIdea(id);
    }
  }, [id]);

  const loadIdea = async (ideaId: string) => {
    try {
      const data = await ideasAPI.getById(ideaId);
      setIdea(data);
      // check if saved for current investor
      if (user && user.role === "INVESTOR") {
        try {
          const saved = await savedIdeasAPI.getByInvestor();
          const exists = saved.some(
            (s) => s.ideaId === ideaId || s.idea?.id === ideaId,
          );
          setIsSaved(Boolean(exists));
        } catch (err) {
          // ignore
        }
      }
    } catch (error) {
      console.error("Failed to load idea:", error);
      toast.error("Failed to load idea");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || user.role !== "INVESTOR" || !id) return;

    try {
      const investor = await investorAPI.getByUserId(user.id);
      if (!investor) {
        toast.error("Please create your investor profile first");
        navigate("/investor/profile");
        return;
      }

      await savedIdeasAPI.save(id);
      setIsSaved(true);
      toast.success("Idea saved successfully");
    } catch (error) {
      toast.error("Failed to save idea");
    }
  };

  const handleExpressInterest = async () => {
    if (!user || user.role !== "INVESTOR" || !id || !interestMessage.trim())
      return;

    setSubmittingInterest(true);
    try {
      const investor = await investorAPI.getByUserId(user.id);
      if (!investor) {
        toast.error("Please create your investor profile first");
        navigate("/investor/profile");
        return;
      }

      await interestAPI.create({
        ideaId: id,
        investorId: investor.id,
        message: interestMessage,
        status: "PENDING",
      });

      setShowInterestDialog(false);
      setInterestMessage("");
      toast.success("Interest expressed successfully");
    } catch (error) {
      toast.error("Failed to express interest");
    } finally {
      setSubmittingInterest(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-gray-500 text-lg">Idea not found</p>
        <Link to="/">
          <Button className="mt-4">Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Ideas
          </Button>
        </Link>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">{idea.category}</Badge>
              <Badge
                variant={idea.status === "PUBLISHED" ? "default" : "outline"}
              >
                {idea.status}
              </Badge>
            </div>
            <CardTitle className="text-3xl">{idea.businessName}</CardTitle>
            <p className="text-lg text-gray-600 mt-2">
              {idea.shortDescription}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-gray-700">
                <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Funding Required</p>
                  <p className="font-semibold">
                    ₹{idea.fundingRequired.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-semibold">{idea.location}</p>
                </div>
              </div>
            </div>

            {user?.role === "INVESTOR" && (
              <div className="flex gap-3 mb-6 pb-6 border-b">
                <Button
                  onClick={handleSave}
                  disabled={isSaved}
                  variant="outline"
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  {isSaved ? "Saved" : "Save Idea"}
                </Button>
                <Dialog
                  open={showInterestDialog}
                  onOpenChange={setShowInterestDialog}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Send className="h-4 w-4 mr-2" />
                      Express Interest
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Express Your Interest</DialogTitle>
                      <DialogDescription>
                        Send a message to the entrepreneur about why you're
                        interested in this idea.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <Textarea
                        placeholder="Write your message here..."
                        value={interestMessage}
                        onChange={(e) => setInterestMessage(e.target.value)}
                        rows={5}
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowInterestDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleExpressInterest}
                          disabled={
                            !interestMessage.trim() || submittingInterest
                          }
                        >
                          {submittingInterest ? "Sending..." : "Send Interest"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            <div className="space-y-6">
              {idea.fullDescription && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Full Description
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {idea.fullDescription}
                  </p>
                </div>
              )}

              {idea.problemStatement && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Problem Statement
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {idea.problemStatement}
                  </p>
                </div>
              )}

              {idea.solution && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">Solution</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {idea.solution}
                  </p>
                </div>
              )}

              {idea.targetMarket && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">Target Market</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {idea.targetMarket}
                  </p>
                </div>
              )}

              {idea.businessModel && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">Business Model</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {idea.businessModel}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About the Entrepreneur</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{idea.entrepreneur.user.name}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
