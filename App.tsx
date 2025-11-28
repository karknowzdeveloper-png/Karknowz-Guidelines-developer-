import React, { useState } from 'react';
import { AppListing, AppSection } from './types';
import MetadataEditor from './components/MetadataEditor';
import IconStudio from './components/IconStudio';
import AuditReport from './components/AuditReport';
import PreviewCard from './components/PreviewCard';
import { Layout, PenTool, Image, ShieldCheck, Smartphone, Menu, X } from 'lucide-react';

const INITIAL_STATE: AppListing = {
  appName: "",
  shortDescription: "",
  fullDescription: "",
  category: "Productivity",
  keywords: []
};

const App: React.FC = () => {
  const [listing, setListing] = useState<AppListing>(INITIAL_STATE);
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.METADATA);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper to close mobile menu on selection
  const navigateTo = (section: AppSection) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false);
  };

  const NavItem = ({ section, icon: Icon, label }: { section: AppSection, icon: any, label: string }) => (
    <button
      onClick={() => navigateTo(section)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium mb-1 ${
        activeSection === section 
          ? 'bg-slate-900 text-white shadow-md' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <Icon size={20} />
      {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
              <Layout size={28} />
              <span>Architect</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-slate-400">
              <X size={24} />
            </button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
             <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-4">Workspace</div>
             <NavItem section={AppSection.METADATA} icon={PenTool} label="Metadata" />
             <NavItem section={AppSection.ICON} icon={Image} label="Icon Studio" />
             <NavItem section={AppSection.AUDIT} icon={ShieldCheck} label="Policy Audit" />
             
             <div className="my-4 border-t border-slate-100"></div>
             
             <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-4">Visualize</div>
             <NavItem section={AppSection.PREVIEW} icon={Smartphone} label="Store Preview" />
          </div>

          <div className="p-4 border-t border-slate-100">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
               <h4 className="font-medium text-slate-900 text-sm mb-1">Current Project</h4>
               <p className="text-xs text-slate-500 truncate">
                 {listing.appName || "Untitled App"}
               </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center px-4 justify-between flex-shrink-0">
           <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-600">
             <Menu size={24} />
           </button>
           <span className="font-semibold text-slate-800">PlayStore Architect</span>
           <div className="w-6"></div> {/* Spacer */}
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
           <div className={`flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth ${activeSection === AppSection.PREVIEW ? 'hidden lg:block' : 'block'}`}>
              <div className="max-w-4xl mx-auto pb-12">
                 <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                      {activeSection === AppSection.METADATA && "Craft your Metadata"}
                      {activeSection === AppSection.ICON && "Design your Icon"}
                      {activeSection === AppSection.AUDIT && "Review & Compliance"}
                      {activeSection === AppSection.PREVIEW && "Store Preview"}
                    </h1>
                    <p className="text-slate-500">
                      {activeSection === AppSection.METADATA && "Use Gemini to generate optimized titles and descriptions."}
                      {activeSection === AppSection.ICON && "Generate professional app icons using AI vision."}
                      {activeSection === AppSection.AUDIT && "Analyze your listing for common pitfalls and policy issues."}
                    </p>
                 </div>

                 {activeSection === AppSection.METADATA && (
                   <MetadataEditor listing={listing} setListing={setListing} />
                 )}
                 {activeSection === AppSection.ICON && (
                   <IconStudio listing={listing} setListing={setListing} />
                 )}
                 {activeSection === AppSection.AUDIT && (
                   <AuditReport listing={listing} />
                 )}
                 {/* Mobile-only preview view in main area */}
                 {activeSection === AppSection.PREVIEW && (
                    <div className="flex justify-center py-4 lg:hidden">
                       <PreviewCard listing={listing} />
                    </div>
                 )}
              </div>
           </div>

           {/* Live Preview Sidebar (Desktop Only) */}
           {activeSection !== AppSection.PREVIEW && (
             <div className="hidden lg:block w-[400px] bg-slate-100 border-l border-slate-200 h-full overflow-y-auto p-8 shadow-inner flex-shrink-0">
               <div className="sticky top-0">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 text-center">Live Preview</h3>
                  <div className="transform scale-[0.85] origin-top">
                    <PreviewCard listing={listing} />
                  </div>
               </div>
             </div>
           )}
           
           {/* Desktop view for dedicated Preview section (takes full width) */}
           {activeSection === AppSection.PREVIEW && (
              <div className="hidden lg:flex flex-1 bg-slate-100 items-center justify-center p-8">
                 <PreviewCard listing={listing} />
              </div>
           )}
        </div>
      </main>
    </div>
  );
};

export default App;
