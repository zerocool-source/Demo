"use client";

import { useState } from "react";
import { User, Key, Bell, Shield, Save, Trash2, Loader2, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function SettingsPage() {
  // Profile state
  const [name] = useState("Alex Creator");
  const [email] = useState("alex@creatorgrowth.io");

  // Theme toggle
  const [darkMode, setDarkMode] = useState(true);

  // API key
  const [showApiKey, setShowApiKey] = useState(false);
  const apiKey = "sk-proj-abc123def456ghi789jkl012mno345pqr678stu901vwx";

  // Notification preferences
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [publishNotifs, setPublishNotifs] = useState(true);
  const [analyticsDigest, setAnalyticsDigest] = useState(false);
  const [agentAlerts, setAgentAlerts] = useState(true);

  // Save state
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Delete dialog
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
  };

  const maskedKey = showApiKey
    ? apiKey
    : `sk-...${apiKey.slice(-4)}`;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and application preferences.
        </p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile
          </CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} readOnly className="bg-muted/50" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={email} readOnly className="bg-muted/50" />
          </div>
          <p className="text-xs text-muted-foreground">
            Profile details are managed through your authentication provider.
          </p>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Appearance</CardTitle>
          <CardDescription>Customize the look and feel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Dark Mode</Label>
              <p className="text-xs text-muted-foreground">
                Toggle between light and dark theme
              </p>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
        </CardContent>
      </Card>

      {/* API Key Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Keys
          </CardTitle>
          <CardDescription>Manage your API credentials</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>API Key</Label>
            <div className="flex items-center gap-2">
              <Input
                value={maskedKey}
                readOnly
                className="bg-muted/50 font-mono text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? "Hide" : "Show"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Use this key to authenticate API requests. Keep it secret.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Configure how you receive updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-xs text-muted-foreground">
                Receive important updates via email
              </p>
            </div>
            <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Publish Notifications</Label>
              <p className="text-xs text-muted-foreground">
                Get notified when content is published or fails
              </p>
            </div>
            <Switch checked={publishNotifs} onCheckedChange={setPublishNotifs} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Weekly Analytics Digest</Label>
              <p className="text-xs text-muted-foreground">
                Receive a weekly summary of your analytics
              </p>
            </div>
            <Switch checked={analyticsDigest} onCheckedChange={setAnalyticsDigest} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Agent Failure Alerts</Label>
              <p className="text-xs text-muted-foreground">
                Get alerted when an AI agent run fails
              </p>
            </div>
            <Switch checked={agentAlerts} onCheckedChange={setAgentAlerts} />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Saved
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>

      {/* Danger Zone */}
      <Card className="border-red-900/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-red-400">
            <Shield className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Delete Account</p>
              <p className="text-xs text-muted-foreground">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-400">Delete Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              This action is permanent and cannot be undone. All your brands, content, analytics,
              and settings will be permanently deleted.
            </p>
            <div className="space-y-2">
              <Label>
                Type <span className="font-mono font-bold text-red-400">DELETE</span> to confirm
              </Label>
              <Input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="border-red-900/50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setDeleteDialog(false);
                setDeleteConfirmText("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteConfirmText !== "DELETE"}
              onClick={() => {
                setDeleteDialog(false);
                setDeleteConfirmText("");
              }}
            >
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
