import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AdminReviewsPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Student Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Here you can manage student feedback and testimonials.</p>
          {/* You can later render reviews list here */}
        </CardContent>
      </Card>
    </div>
  );
}
