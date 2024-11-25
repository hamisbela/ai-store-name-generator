import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Copy, Coffee, Check, Sparkles, Rocket, Star, Lightbulb, ShoppingBag } from 'lucide-react';
import { genAI } from '@/lib/gemini';

export default function Home() {
  const [description, setDescription] = useState('');
  const [names, setNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateNames = async () => {
    if (!description.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      if (!genAI) {
        throw new Error("API key not configured. Please add your Gemini API key to continue.");
      }
      
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Generate 5 creative, memorable, and catchy store names based on this description: ${description}. Consider the store type, target audience, and industry. The names should be unique, brandable, and available as .com domains. Each name should be 1-3 words maximum. Return only the store names, one per line, without any additional text or explanations.`;
      
      const result = await model.generateContent(prompt);
      const nameList = result.response.text().split('\n').filter(name => name.trim());
      setNames(nameList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating store names');
      setNames([]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 py-4">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-transparent bg-clip-text leading-tight">
            AI Store Name Generator ✨
          </h1>
          <p className="text-xl text-gray-600">
            Create the perfect name for your store in seconds with our AI-powered generator! 🏪
          </p>
        </div>
        
        <div className="gradient-border mb-8">
          <div className="p-8">
            <div className="space-y-6">
              <Textarea
                placeholder="✍️ Describe your store type, products, target audience, and style..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px] text-lg border-2 focus:border-cyan-400"
              />
              
              <Button 
                onClick={generateNames}
                disabled={loading || !description.trim()}
                className="w-full text-lg py-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              >
                {loading ? (
                  <>
                    <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                    Creating Magic...
                  </>
                ) : (
                  <>
                    <Rocket className="mr-2 h-5 w-5" />
                    Generate Store Names ✨
                  </>
                )}
              </Button>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>

        {names.length > 0 && (
          <div className="space-y-4 mb-12">
            {names.map((name, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-cyan-200">
                <div className="flex justify-between items-center gap-4">
                  <p className="text-lg flex-grow">{name}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(name, index)}
                      className="flex items-center gap-2 min-w-[120px] hover:bg-cyan-50"
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="h-4 w-4 text-green-500" />
                          <span>Copied! ✅</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </Button>
                    <a
                      href="https://www.shopify.com/free-trial-offer"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <Button
                        size="sm"
                        className="flex items-center gap-2 min-w-[180px] bg-[#008060] hover:bg-[#006e52]"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        <span>Start Free on Shopify</span>
                      </Button>
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Card className="p-8 bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 mb-16">
          <div className="text-center space-y-4">
            <Coffee className="h-12 w-12 mx-auto text-cyan-500" />
            <h2 className="text-2xl font-bold">Support Our Work ❤️</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Help us maintain and improve our AI tools by supporting our API & hosting costs. 
              Your contribution helps keep this tool free for everyone! 🙏
            </p>
            <a
              href="https://roihacks.gumroad.com/coffee"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                <Coffee className="mr-2 h-5 w-5" />
                Buy Us a Coffee ☕
              </Button>
            </a>
          </div>
        </Card>

        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl shadow-xl p-8 mb-16">
          <article className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-transparent bg-clip-text">
              Free AI Store Name Generator: Create Your Perfect Store Name in Seconds ⚡
            </h2>
            
            <div className="space-y-6">
              <p className="text-gray-600 leading-relaxed">
                Looking for the perfect name for your store? Our free AI-powered store name generator
                combines cutting-edge artificial intelligence with retail expertise to help entrepreneurs
                find unique, memorable names that capture their store's essence and attract customers.
              </p>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Star className="h-6 w-6 text-cyan-500" />
                  Why Choose Our Free AI Store Name Generator? 🎯
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="mr-2">🏪</span>
                    <span>Instant generation of unique and catchy store names</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">🤖</span>
                    <span>AI-powered technology that understands retail trends and customer appeal</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">⚡</span>
                    <span>Save time in your store launch process</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✨</span>
                    <span>Get multiple creative options instantly</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">💎</span>
                    <span>Free to use with professional-quality results</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-cyan-500" />
                  The Power of AI in Store Name Generation 💫
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Our advanced AI technology analyzes successful retail brands, understands market trends,
                  and combines this knowledge with your specific store concept. This results
                  in names that are:
                </p>
                <ul className="mt-4 space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span>🏪</span> Perfect for retail businesses
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🎯</span> Industry-appropriate
                  </li>
                  <li className="flex items-center gap-2">
                    <span>💡</span> Unique and memorable
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🌟</span> Customer-friendly
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-2xl font-semibold mb-4">Perfect For Every Store Type 🏬</h3>
                <p className="text-gray-600 leading-relaxed">
                  Our AI store name generator is perfect for:
                </p>
                <ul className="mt-4 space-y-2 text-gray-600">
                  <li>• Retail shops and boutiques</li>
                  <li>• Online stores and e-commerce</li>
                  <li>• Fashion and accessories stores</li>
                  <li>• Food and beverage establishments</li>
                  <li>• Beauty and wellness shops</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-2xl font-semibold mb-4">Tips for Great Store Names 🎯</h3>
                <ol className="list-decimal pl-5 space-y-2 text-gray-600">
                  <li>Be specific about your store's specialty</li>
                  <li>Include your target market and style</li>
                  <li>Consider local market and competition</li>
                  <li>Think about branding potential</li>
                  <li>Test different store descriptions</li>
                </ol>
              </div>
            </div>
          </article>
        </div>

        <Card className="p-8 bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 mb-16">
          <div className="text-center space-y-4">
            <Coffee className="h-12 w-12 mx-auto text-cyan-500" />
            <h2 className="text-2xl font-bold">Love Our Tool? Support Its Growth! 🚀</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Your support helps us maintain our AI infrastructure, improve the tool's capabilities,
              and keep it accessible to everyone. Every coffee counts! ☕
            </p>
            <div className="pt-2">
              <a
                href="https://roihacks.gumroad.com/coffee"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                  <Coffee className="mr-2 h-5 w-5" />
                  Buy Us a Coffee ☕
                </Button>
              </a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}