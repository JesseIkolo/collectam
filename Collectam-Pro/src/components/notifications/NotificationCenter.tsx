"use client";

import { useState, useEffect } from "react";
import { Bell, X, Settings, Check, Trash2, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { notificationService, Notification, NotificationPreferences } from "@/services/NotificationService";
import { toast } from "sonner";

interface NotificationCenterProps {
  className?: string;
}

export function NotificationCenter({ className }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>(
    notificationService.getPreferences()
  );
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Initialize notification service
    const initializeNotifications = async () => {
      const connected = await notificationService.connect();
      setIsConnected(connected);
      
      if (connected) {
        toast.success("Notifications temps réel activées");
      } else {
        toast.error("Impossible de se connecter aux notifications");
      }
    };

    initializeNotifications();

    // Load initial data
    setNotifications(notificationService.getNotifications());
    setUnreadCount(notificationService.getUnreadCount());

    // Setup event listeners
    const handleNotificationReceived = (notification: Notification) => {
      setNotifications(notificationService.getNotifications());
      setUnreadCount(notificationService.getUnreadCount());
      
      // Show toast for new notification
      toast(notification.title, {
        description: notification.body,
        duration: notification.priority === 'high' ? 10000 : 5000,
      });
    };

    const handleNotificationsUpdated = (updatedNotifications: Notification[]) => {
      setNotifications(updatedNotifications);
      setUnreadCount(notificationService.getUnreadCount());
    };

    const handleConnectionLost = () => {
      setIsConnected(false);
      toast.error("Connexion aux notifications perdue");
    };

    const handlePreferencesUpdated = (newPreferences: NotificationPreferences) => {
      setPreferences(newPreferences);
    };

    // Register listeners
    notificationService.on('notification_received', handleNotificationReceived);
    notificationService.on('notifications_updated', handleNotificationsUpdated);
    notificationService.on('connection_lost', handleConnectionLost);
    notificationService.on('preferences_updated', handlePreferencesUpdated);

    // Cleanup
    return () => {
      notificationService.off('notification_received', handleNotificationReceived);
      notificationService.off('notifications_updated', handleNotificationsUpdated);
      notificationService.off('connection_lost', handleConnectionLost);
      notificationService.off('preferences_updated', handlePreferencesUpdated);
    };
  }, []);

  const handleMarkAsRead = (notificationIds: string[]) => {
    notificationService.markAsRead(notificationIds);
  };

  const handleMarkAllAsRead = () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length > 0) {
      handleMarkAsRead(unreadIds);
    }
  };

  const handleRemoveNotification = (notificationId: string) => {
    notificationService.removeNotification(notificationId);
  };

  const handleClearAll = () => {
    notificationService.clearAll();
  };

  const handlePreferenceChange = (key: keyof NotificationPreferences, value: boolean) => {
    notificationService.updatePreferences({ [key]: value });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'collection_assigned':
        return '🗑️';
      case 'collection_started':
        return '🚛';
      case 'collection_completed':
        return '✅';
      case 'new_mission':
        return '📋';
      case 'mission_reminder':
        return '⏰';
      default:
        return '📢';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'normal':
        return 'bg-blue-500';
      case 'low':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes}min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;
    return date.toLocaleDateString();
  };

  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-80 p-0" align="end">
          <Card className="border-0 shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  Notifications
                  {!isConnected && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      Hors ligne
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMarkAllAsRead}
                      className="h-8 px-2 text-xs"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Tout lire
                    </Button>
                  )}
                  <Dialog open={showSettings} onOpenChange={setShowSettings}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Settings className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Paramètres de notifications</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="realTime">Notifications temps réel</Label>
                          <Switch
                            id="realTime"
                            checked={preferences.realTime}
                            onCheckedChange={(checked) => handlePreferenceChange('realTime', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="sound">Son</Label>
                          <Switch
                            id="sound"
                            checked={preferences.sound}
                            onCheckedChange={(checked) => handlePreferenceChange('sound', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="desktop">Notifications bureau</Label>
                          <Switch
                            id="desktop"
                            checked={preferences.desktop}
                            onCheckedChange={(checked) => handlePreferenceChange('desktop', checked)}
                          />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <Label htmlFor="collections">Collectes</Label>
                          <Switch
                            id="collections"
                            checked={preferences.collections}
                            onCheckedChange={(checked) => handlePreferenceChange('collections', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="missions">Missions</Label>
                          <Switch
                            id="missions"
                            checked={preferences.missions}
                            onCheckedChange={(checked) => handlePreferenceChange('missions', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="system">Système</Label>
                          <Switch
                            id="system"
                            checked={preferences.system}
                            onCheckedChange={(checked) => handlePreferenceChange('system', checked)}
                          />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Aucune notification
                </div>
              ) : (
                <>
                  <ScrollArea className="h-80">
                    <div className="space-y-1 p-2">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg border transition-colors hover:bg-muted/50 ${
                            !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-background'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 text-lg">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm font-medium truncate">
                                  {notification.title}
                                </p>
                                <div className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`} />
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">
                                {notification.body}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(notification.timestamp)}
                                </span>
                                <div className="flex items-center gap-1">
                                  {!notification.read && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleMarkAsRead([notification.id])}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Check className="h-3 w-3" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveNotification(notification.id)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  
                  {notifications.length > 0 && (
                    <div className="p-2 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearAll}
                        className="w-full text-xs"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Effacer tout
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
}
