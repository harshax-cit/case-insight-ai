import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  HelpCircle,
  Folder,
  BarChart3,
  Shield,
  ChevronRight,
  Sparkles,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface SidebarProps {
  activeItem?: string;
  onNavigate?: (item: string) => void;
}

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'cases', icon: FileText, label: 'Cases' },
  { id: 'queue', icon: Folder, label: 'My Queue', badge: 12 },
  { id: 'customers', icon: Users, label: 'Customers' },
  { id: 'reports', icon: BarChart3, label: 'Reports' },
  { id: 'compliance', icon: Shield, label: 'Compliance' },
];

export function Sidebar({ activeItem = 'cases', onNavigate }: SidebarProps) {
  const [helpOpen, setHelpOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const handleBottomAction = (id: string) => {
    if (id === 'help') {
      setHelpOpen(true);
    } else if (id === 'settings') {
      setSettingsOpen(true);
    }
  };

  const handleLogout = () => {
    toast.success('Logged out successfully', {
      description: 'Redirecting to login page...',
    });
  };

  return (
    <>
      <aside className="w-64 flex-shrink-0 bg-sidebar text-sidebar-foreground flex flex-col h-full overflow-hidden">
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sidebar-primary to-purple-500 flex items-center justify-center shadow-lg">
              <Shield className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight">Appian Claims</span>
              <div className="flex items-center gap-1 text-[10px] text-sidebar-foreground/60">
                <Sparkles className="w-3 h-3" />
                <span>AI-Powered</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 py-5 px-3 overflow-auto">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
            Main Menu
          </p>
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeItem;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate?.(item.id)}
                  className={cn(
                    "w-full nav-item",
                    isActive 
                      ? "nav-item-active" 
                      : "nav-item-inactive"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-sidebar-primary text-sidebar-primary-foreground text-xs font-semibold">
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Bottom Navigation */}
        <div className="py-4 px-3 border-t border-sidebar-border">
          <div className="space-y-1">
            <button
              onClick={() => handleBottomAction('help')}
              className="w-full nav-item nav-item-inactive"
            >
              <HelpCircle className="w-5 h-5" />
              <span>Help & Support</span>
            </button>
            <button
              onClick={() => handleBottomAction('settings')}
              className="w-full nav-item nav-item-inactive"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </div>
        </div>
        
        {/* User Profile */}
        <div className="p-4 border-t border-sidebar-border">
          <div 
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors cursor-pointer"
            onClick={handleLogout}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sidebar-primary/80 to-purple-500/80 flex items-center justify-center text-sm font-semibold">
              PM
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Priya Mehta</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">Senior Claims Agent</p>
            </div>
            <LogOut className="w-4 h-4 text-sidebar-foreground/60" />
          </div>
        </div>
      </aside>

      {/* Help Dialog */}
      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              Help & Support
            </DialogTitle>
            <DialogDescription>
              Get assistance with the JIT-Knowledge AI system
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium text-sm mb-2">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button 
                    className="text-primary hover:underline"
                    onClick={() => {
                      toast.info('Opening User Guide...');
                      setHelpOpen(false);
                    }}
                  >
                    📖 User Guide & Documentation
                  </button>
                </li>
                <li>
                  <button 
                    className="text-primary hover:underline"
                    onClick={() => {
                      toast.info('Opening Video Tutorials...');
                      setHelpOpen(false);
                    }}
                  >
                    🎥 Video Tutorials
                  </button>
                </li>
                <li>
                  <button 
                    className="text-primary hover:underline"
                    onClick={() => {
                      toast.info('Opening FAQs...');
                      setHelpOpen(false);
                    }}
                  >
                    ❓ Frequently Asked Questions
                  </button>
                </li>
              </ul>
            </div>
            <div className="p-4 rounded-lg border border-border">
              <h4 className="font-medium text-sm mb-2">Contact Support</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Need help? Our support team is available 24/7.
              </p>
              <Button 
                className="w-full"
                onClick={() => {
                  toast.success('Support ticket created!', {
                    description: 'We\'ll get back to you within 24 hours.',
                  });
                  setHelpOpen(false);
                }}
              >
                Contact Support Team
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Settings
            </DialogTitle>
            <DialogDescription>
              Customize your JIT-Knowledge AI experience
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <Label htmlFor="notifications" className="font-medium">Notifications</Label>
                <p className="text-xs text-muted-foreground">Receive alerts and updates</p>
              </div>
              <Switch 
                id="notifications" 
                checked={notifications}
                onCheckedChange={(checked) => {
                  setNotifications(checked);
                  toast.success(checked ? 'Notifications enabled' : 'Notifications disabled');
                }}
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <Label htmlFor="dark-mode" className="font-medium">Dark Mode</Label>
                <p className="text-xs text-muted-foreground">Switch to dark theme</p>
              </div>
              <Switch 
                id="dark-mode" 
                checked={darkMode}
                onCheckedChange={(checked) => {
                  setDarkMode(checked);
                  toast.info(checked ? 'Dark mode enabled' : 'Light mode enabled', {
                    description: 'Theme switching would apply in production',
                  });
                }}
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <Label htmlFor="auto-refresh" className="font-medium">Auto-Refresh</Label>
                <p className="text-xs text-muted-foreground">Keep data up to date automatically</p>
              </div>
              <Switch 
                id="auto-refresh" 
                checked={autoRefresh}
                onCheckedChange={(checked) => {
                  setAutoRefresh(checked);
                  toast.success(checked ? 'Auto-refresh enabled' : 'Auto-refresh disabled');
                }}
              />
            </div>
            <div className="pt-4 border-t border-border">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  toast.success('Settings saved successfully');
                  setSettingsOpen(false);
                }}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
