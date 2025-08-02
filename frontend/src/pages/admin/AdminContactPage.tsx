import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AdminContactPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Contact Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Here you can view and respond to messages sent through the contact form.</p>
          {/* You can later display a table of contact messages */}
        </CardContent>
      </Card>
    </div>
  );
}
