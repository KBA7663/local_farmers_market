import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Star, MessageCircle, MapPin, Truck, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import type { Database } from "@/integrations/supabase/types";

type Product = Database["public"]["Tables"]["products"]["Row"];

const categories = ["all", "vegetables", "fruits", "grains", "dairy", "livestock"] as const;

export default function Products() {
  const { user, role } = useAuth();
  const [products, setProducts] = useState<(Product & { farmer_name?: string; avg_rating?: number })[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selected, setSelected] = useState<(Product & { farmer_name?: string; avg_rating?: number }) | null>(null);
  const [orderQty, setOrderQty] = useState("1");
  const [paymentMethod, setPaymentMethod] = useState<"mobile_money" | "cash_on_delivery">("mobile_money");
  const [paymentPhone, setPaymentPhone] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);

  const fetchProducts = async () => {
    let q = supabase.from("products").select("*").eq("status", "approved").order("created_at", { ascending: false });
    if (categoryFilter !== "all") q = q.eq("category", categoryFilter as Database["public"]["Enums"]["product_category"]);
    if (search) q = q.ilike("name", `%${search}%`);
    const { data } = await q;
    if (data) {
      const enriched = await Promise.all(data.map(async (p) => {
        const [profRes, revRes] = await Promise.all([
          supabase.from("profiles").select("full_name").eq("user_id", p.farmer_id).single(),
          supabase.from("reviews").select("rating").eq("product_id", p.id),
        ]);
        const avg = revRes.data?.length ? revRes.data.reduce((s, r) => s + r.rating, 0) / revRes.data.length : 0;
        return { ...p, farmer_name: profRes.data?.full_name, avg_rating: avg };
      }));
      setProducts(enriched);
    }
  };

  const fetchReviews = async (productId: string) => {
    const { data } = await supabase.from("reviews").select("*, profiles:buyer_id(full_name)").eq("product_id", productId);
    setReviews(data || []);
  };

  useEffect(() => { fetchProducts(); }, [categoryFilter, search]);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selected) return;
    if (paymentMethod === "mobile_money" && !paymentPhone.trim()) {
      toast({ title: "Enter phone number", variant: "destructive" });
      return;
    }
    const qty = parseInt(orderQty);
    const total = qty * selected.price;
    const { error } = await supabase.from("orders").insert({
      buyer_id: user.id,
      product_id: selected.id,
      farmer_id: selected.farmer_id,
      quantity: qty,
      total_price: total,
      payment_phone: paymentMethod === "mobile_money" ? paymentPhone : "",
      payment_method: paymentMethod,
    });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Order placed!", description: `UGX ${total.toLocaleString()}` });
    setSelected(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Browse Products</h1>
        <div className="flex flex-wrap gap-3 mb-6">
          <Input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              {categories.map(c => (
                <SelectItem key={c} value={c}>{c === "all" ? "All Categories" : c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map(p => (
            <Card key={p.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => { setSelected(p); fetchReviews(p.id); }}>
              <div className="relative">
                {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-40 object-cover" />}
                {p.discount_percent > 0 && (
                  <Badge className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white animate-pulse">
                    {p.discount_percent}% OFF
                  </Badge>
                )}
              </div>
              <CardContent className="pt-4">
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm text-muted-foreground capitalize">{p.category}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                    Items left: {p.quantity}
                  </span>
                </div>
                {p.avg_rating ? (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3 fill-accent text-accent" />
                    <span className="text-sm">{p.avg_rating.toFixed(1)}</span>
                  </div>
                ) : null}
                <p className="font-bold text-primary mt-2">UGX {p.price.toLocaleString()}/{p.unit}</p>
                <Button className="w-full mt-4" variant="outline">See details</Button>
              </CardContent>
            </Card>
          ))}
          {products.length === 0 && <p className="text-muted-foreground col-span-full text-center py-10">No products found</p>}
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={o => { if (!o) setSelected(null); }}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader><DialogTitle>{selected.name}</DialogTitle></DialogHeader>
              <div className="relative">
                {selected.image_url && <img src={selected.image_url} alt={selected.name} className="w-full h-48 object-cover rounded-lg" />}
                {selected.discount_percent > 0 && (
                  <Badge className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm shadow animate-pulse">
                    {selected.discount_percent}% OFF
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">{selected.description}</p>
              <div className="flex justify-between items-center">
                <p className="font-bold text-primary text-xl">UGX {selected.price.toLocaleString()}/{selected.unit}</p>
                <div className="text-right">
                  <p className="text-sm font-semibold text-orange-600">{selected.quantity} {selected.unit} left in stock</p>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 space-y-3 mt-4 border">
                <h4 className="font-semibold flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> Delivery & Shipping</h4>
                <div className="text-sm space-y-2 text-muted-foreground">
                   <div className="flex items-start gap-2">
                     <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                     <p><strong>Pickup Stations:</strong> Available at Kabale Central Market, Mwanjari, Eso, and more.<br/>
                     <span className="text-xs text-primary font-medium">Ready in 2-4 hours from order time.</span></p>
                   </div>
                   <div className="flex items-start gap-2">
                     <Truck className="h-4 w-4 mt-0.5 shrink-0" />
                     <p><strong>Home Delivery:</strong> Estimated UGX 2,000 - 5,000 depending on distance.</p>
                   </div>
                </div>

                <div className="border-t pt-3 mt-3">
                  <h4 className="font-semibold flex items-center gap-2 mb-2"><ShieldCheck className="h-4 w-4 text-green-600" /> Returns Policy</h4>
                  <ul className="text-xs text-muted-foreground list-disc pl-5 space-y-1">
                    <li>Inspect produce immediately upon delivery or pickup.</li>
                    <li>Eligible for return within 24 hours if spoiled or damaged.</li>
                    <li>Refunds are processed to your Mobile Money account within 1-2 business days.</li>
                  </ul>
                </div>
              </div>

              <Button variant="outline" className="w-full gap-2 mt-2" onClick={(e) => {
                 e.preventDefault();
                 toast({ title: "Chat Opened", description: `Starting chat with ${selected.farmer_name || "the farmer"}...` });
              }}>
                <MessageCircle className="h-4 w-4" /> Ask {selected.farmer_name || "Farmer"} a Question
              </Button>

              {reviews.length > 0 && (
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-semibold mb-3">Product Ratings & Reviews</h4>
                  <div className="space-y-4">
                    {reviews.map(r => (
                      <div key={r.id} className="text-sm bg-muted/20 p-3 rounded-lg border">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <div className="flex items-center gap-1 font-medium mb-1">
                              {(r as any).profiles?.full_name || "Buyer"}
                              <Badge variant="secondary" className="text-[10px] h-5 px-1.5 flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
                                <CheckCircle2 className="h-3 w-3" /> Verified Purchaser
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map(star => (
                                <Star key={star} className={`h-3 w-3 ${star <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
                        </div>
                        {r.comment && <p className="text-muted-foreground mt-2 italic">"{r.comment}"</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {user && role === "buyer" && selected.quantity > 0 && (
                <form onSubmit={handleOrder} className="border-t pt-3 mt-3 space-y-3">
                  <h4 className="font-semibold">Place Order</h4>
                  <div><Label>Quantity</Label><Input type="number" min="1" max={selected.quantity} value={orderQty} onChange={e => setOrderQty(e.target.value)} required /></div>
                  <p className="font-semibold">Total: UGX {(parseInt(orderQty || "0") * selected.price).toLocaleString()}</p>

                  <div className="space-y-2">
                    <Label className="font-semibold">Payment Method</Label>
                    <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
                      <div className="flex items-center space-x-2 border rounded-lg p-3">
                        <RadioGroupItem value="mobile_money" id="pm_momo" />
                        <Label htmlFor="pm_momo" className="flex-1 cursor-pointer">
                          <span className="font-medium">📱 Mobile Money</span>
                          <p className="text-xs text-muted-foreground">MTN or Airtel (simulated)</p>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-3">
                        <RadioGroupItem value="cash_on_delivery" id="pm_cash" />
                        <Label htmlFor="pm_cash" className="flex-1 cursor-pointer">
                          <span className="font-medium">💵 Cash on Delivery</span>
                          <p className="text-xs text-muted-foreground">Pay when you receive</p>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {paymentMethod === "mobile_money" && (
                    <div className="border rounded-lg p-3 bg-muted/50">
                      <Input value={paymentPhone} onChange={e => setPaymentPhone(e.target.value)} placeholder="+256 7XX XXX XXX" required />
                    </div>
                  )}
                  <Button type="submit" className="w-full">Confirm Order</Button>
                </form>
              )}
              {!user && <p className="text-sm text-muted-foreground border-t pt-3 mt-3">Please <a href="/login" className="text-primary underline">sign in</a> to place orders.</p>}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
