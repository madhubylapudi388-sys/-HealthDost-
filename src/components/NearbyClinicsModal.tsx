import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  Phone,
  Clock,
  ShieldCheck,
  Building2,
  Stethoscope,
  Pill,
  AlertOctagon,
  Search,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Heart,
  Check,
  Copy,
  SlidersHorizontal,
  Compass,
  Map,
  X,
  PhoneCall,
  Info
} from 'lucide-react';
import { NearbyClinic, ClinicFacilityType, LanguageCode } from '../types';
import { TRANSLATIONS } from '../data/languages';
import {
  getBrowserGeolocation,
  reverseGeocodeLocality,
  formatDistance,
  POPULAR_LOCATION_PRESETS,
  CityLocationPreset
} from '../utils/geolocation';
import { getNearbyClinics } from '../services/clinicService';

interface NearbyClinicsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  initialFacilityFilter?: ClinicFacilityType;
  filterEmergencyOnly?: boolean;
}

export const NearbyClinicsModal: React.FC<NearbyClinicsModalProps> = ({
  isOpen,
  onClose,
  language,
  initialFacilityFilter = 'all',
  filterEmergencyOnly = false,
}) => {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [localityName, setLocalityName] = useState<string>('Detecting location...');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [clinics, setClinics] = useState<NearbyClinic[]>([]);
  const [isLoadingClinics, setIsLoadingClinics] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ClinicFacilityType>(initialFacilityFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [emergencyOnly, setEmergencyOnly] = useState(filterEmergencyOnly);
  const [freeTestsOnly, setFreeTestsOnly] = useState(false);
  const [maxDistanceKm, setMaxDistanceKm] = useState(20);

  const [showCityPicker, setShowCityPicker] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeMapClinic, setActiveMapClinic] = useState<NearbyClinic | null>(null);

  const t = TRANSLATIONS[language];

  // Request live geolocation on mount or when modal opens
  useEffect(() => {
    if (isOpen) {
      if (!coords) {
        requestLiveLocation();
      } else {
        fetchClinics(coords.lat, coords.lng, localityName);
      }
    }
  }, [isOpen]);

  const requestLiveLocation = async () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    try {
      const position = await getBrowserGeolocation(true, 10000);
      setCoords({ lat: position.lat, lng: position.lng });
      setAccuracy(position.accuracy);

      const locality = await reverseGeocodeLocality(position.lat, position.lng);
      setLocalityName(locality);
      await fetchClinics(position.lat, position.lng, locality);
    } catch (err: any) {
      console.warn('Geolocation acquisition error, falling back to default city:', err);
      setLocationError(err.message || 'Location permission not available');
      // Default to Delhi Central or Mumbai preset so user sees data immediately
      const defaultCity = POPULAR_LOCATION_PRESETS[0];
      setCoords({ lat: defaultCity.lat, lng: defaultCity.lng });
      setLocalityName(`${defaultCity.name}, ${defaultCity.state}`);
      await fetchClinics(defaultCity.lat, defaultCity.lng, `${defaultCity.name}, ${defaultCity.state}`);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const selectPresetCity = async (city: CityLocationPreset) => {
    setCoords({ lat: city.lat, lng: city.lng });
    setLocalityName(`${city.name}, ${city.state}`);
    setLocationError(null);
    setShowCityPicker(false);
    await fetchClinics(city.lat, city.lng, `${city.name}, ${city.state}`);
  };

  const fetchClinics = async (lat: number, lng: number, locName: string) => {
    setIsLoadingClinics(true);
    try {
      const results = await getNearbyClinics(lat, lng, locName, activeFilter, maxDistanceKm);
      setClinics(results);
    } catch (err) {
      console.error('Failed to load clinics:', err);
    } finally {
      setIsLoadingClinics(false);
    }
  };

  // Re-fetch when active filter or max distance changes
  useEffect(() => {
    if (coords) {
      fetchClinics(coords.lat, coords.lng, localityName);
    }
  }, [activeFilter, maxDistanceKm]);

  // Copy clinic details to clipboard
  const handleCopyInfo = (clinic: NearbyClinic) => {
    const text = `🏥 ${clinic.name}\n📍 ${clinic.address}, ${clinic.locality}\n🕒 Timings: ${clinic.timing}\n📞 Phone: ${clinic.phone || '108 / 104'}\n🩺 Services: ${clinic.services.join(', ')}\n🗺️ Directions: ${clinic.directionsUrl}`;
    navigator.clipboard.writeText(text);
    setCopiedId(clinic.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Filter list by keyword and quick toggles
  const filteredClinics = clinics.filter((clinic) => {
    if (emergencyOnly && !clinic.isEmergency24x7) return false;
    if (freeTestsOnly && clinic.freeServices.length === 0) return false;

    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      clinic.name.toLowerCase().includes(query) ||
      clinic.locality.toLowerCase().includes(query) ||
      clinic.address.toLowerCase().includes(query) ||
      clinic.doctorAvailable.toLowerCase().includes(query) ||
      clinic.services.some((s) => s.toLowerCase().includes(query)) ||
      clinic.freeServices.some((s) => s.toLowerCase().includes(query))
    );
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-150">
      <div
        className="bg-[#faf9f5] w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl border border-[#deded3] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Header */}
        <div className="bg-[#ffffff] px-4 sm:px-6 py-4 border-b border-[#e5e5df] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <MapPin className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-[#33332d]">
                  Find Nearby Clinics & PHCs
                </h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Live GPS
                </span>
              </div>
              <p className="text-xs text-[#66655c]">
                Ayushman Arogya Mandirs, Govt Primary Health Centres & Community Hospitals
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#faf9f5] hover:bg-[#edece4] text-[#66655c] hover:text-[#33332d] flex items-center justify-center transition-colors cursor-pointer border border-[#deded3]"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Location Detection & City Selector Strip */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-[#3f3f2d] text-white px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Navigation className="w-4 h-4 text-emerald-300 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-emerald-200 uppercase tracking-wider">
                  Current Location:
                </span>
                {accuracy && (
                  <span className="text-[10px] bg-white/15 px-1.5 py-0.2 rounded text-emerald-100">
                    ±{Math.round(accuracy)}m precision
                  </span>
                )}
              </div>
              <div className="text-sm font-bold truncate text-white">
                {isLoadingLocation ? 'Acquiring GPS fix...' : localityName}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* GPS Refresh Button */}
            <button
              onClick={requestLiveLocation}
              disabled={isLoadingLocation}
              className="px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 active:bg-white/30 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              title="Refresh GPS location"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLocation ? 'animate-spin' : ''}`} />
              <span className="hidden xs:inline">Live GPS</span>
            </button>

            {/* City Preset Picker Button */}
            <div className="relative">
              <button
                onClick={() => setShowCityPicker(!showCityPicker)}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Change City / Taluk</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {/* City Presets Dropdown */}
              {showCityPicker && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowCityPicker(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 max-h-72 overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-slate-800">
                    <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1 flex items-center justify-between">
                      <span>Select Indian Region</span>
                      <span className="text-[10px] text-emerald-600 font-bold">23+ Presets</span>
                    </div>
                    <div className="space-y-0.5">
                      {POPULAR_LOCATION_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => selectPresetCity(preset)}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <div>
                            <div className="text-slate-900 font-bold">{preset.name}</div>
                            <div className="text-[11px] text-slate-500">{preset.state}</div>
                          </div>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                              preset.type === 'metro'
                                ? 'bg-blue-50 text-blue-700'
                                : preset.type === 'rural_hub'
                                ? 'bg-amber-50 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {preset.type === 'metro' ? 'Metro' : preset.type === 'rural_hub' ? 'Rural' : 'Tier 2'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Location Notice / Error Fallback */}
        {locationError && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-6 py-2 text-xs text-amber-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{locationError}</span>
            </div>
            <button
              onClick={() => setShowCityPicker(true)}
              className="text-emerald-700 font-bold underline cursor-pointer shrink-0"
            >
              Choose City
            </button>
          </div>
        )}

        {/* Emergency Helplines Quick Banner */}
        <div className="bg-rose-50 border-b border-rose-200 px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-xs text-rose-900">
          <div className="flex items-center gap-2 font-bold">
            <AlertOctagon className="w-4 h-4 text-rose-600" />
            <span>Emergency or Chest Pain? Immediate Helplines:</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="tel:108"
              className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
            >
              <PhoneCall className="w-3 h-3" />
              <span>108 (Ambulance)</span>
            </a>
            <a
              href="tel:104"
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
            >
              <Phone className="w-3 h-3" />
              <span>104 (Health Advice)</span>
            </a>
          </div>
        </div>

        {/* Search, Distance & Category Filter Tabs */}
        <div className="bg-[#ffffff] px-4 sm:px-6 py-3 border-b border-[#e5e5df] space-y-3 shrink-0">
          {/* Search Input and Toggles */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search clinics by name, doctor, blood test, BP check, or locality..."
                className="w-full pl-9.5 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all text-slate-800"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setEmergencyOnly(!emergencyOnly)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                  emergencyOnly
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>24x7 Emergency</span>
              </button>

              <button
                onClick={() => setFreeTestsOnly(!freeTestsOnly)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                  freeTestsOnly
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Free BP / Sugar Tests</span>
              </button>
            </div>
          </div>

          {/* Facility Type Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-[#5a5a40] text-white shadow-xs'
                  : 'bg-[#faf9f5] hover:bg-[#edece4] text-[#66655c] border border-[#deded3]'
              }`}
            >
              All Facilities ({clinics.length})
            </button>

            <button
              onClick={() => setActiveFilter('arogya_mandir')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                activeFilter === 'arogya_mandir'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-[#faf9f5] hover:bg-[#edece4] text-[#66655c] border border-[#deded3]'
              }`}
            >
              <Heart className="w-3 h-3 text-emerald-400" />
              <span>Ayushman Arogya Mandir / PHC</span>
            </button>

            <button
              onClick={() => setActiveFilter('chc')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeFilter === 'chc'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-[#faf9f5] hover:bg-[#edece4] text-[#66655c] border border-[#deded3]'
              }`}
            >
              Community Health Centre (CHC)
            </button>

            <button
              onClick={() => setActiveFilter('district_hospital')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeFilter === 'district_hospital'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-[#faf9f5] hover:bg-[#edece4] text-[#66655c] border border-[#deded3]'
              }`}
            >
              District / Civil Hospital
            </button>

            <button
              onClick={() => setActiveFilter('jan_aushadhi')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                activeFilter === 'jan_aushadhi'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-[#faf9f5] hover:bg-[#edece4] text-[#66655c] border border-[#deded3]'
              }`}
            >
              <Pill className="w-3 h-3 text-amber-300" />
              <span>PM Jan Aushadhi (Generic Meds)</span>
            </button>

            <button
              onClick={() => setActiveFilter('private_clinic')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeFilter === 'private_clinic'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-[#faf9f5] hover:bg-[#edece4] text-[#66655c] border border-[#deded3]'
              }`}
            >
              Private Clinics & Diagnostics
            </button>
          </div>
        </div>

        {/* Clinics List Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {isLoadingClinics ? (
            <div className="py-16 text-center">
              <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-800">
                Finding closest Primary Healthcare Centers near {localityName}...
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Calculating road distance & checking available doctors
              </p>
            </div>
          ) : filteredClinics.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 p-6">
              <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-800">No matching clinics found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Try expanding your search query or switching category filters. You can also pick a nearby major city.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                  setEmergencyOnly(false);
                  setFreeTestsOnly(false);
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredClinics.map((clinic, idx) => {
                const isClosest = idx === 0 && clinic.distanceKm < 3;
                return (
                  <div
                    key={clinic.id}
                    className={`bg-[#ffffff] rounded-2xl p-4 sm:p-5 border transition-all shadow-xs hover:shadow-md relative overflow-hidden ${
                      isClosest
                        ? 'border-emerald-500/80 ring-2 ring-emerald-500/20'
                        : 'border-[#e5e5df]'
                    }`}
                  >
                    {/* Top Highlight Badge */}
                    {isClosest && (
                      <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl shadow-xs flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Nearest Center</span>
                      </div>
                    )}

                    {/* Main Facility Info Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 text-white shadow-xs ${
                            clinic.type === 'arogya_mandir' || clinic.type === 'phc'
                              ? 'bg-emerald-600'
                              : clinic.type === 'district_hospital'
                              ? 'bg-slate-800'
                              : clinic.type === 'chc'
                              ? 'bg-blue-600'
                              : clinic.type === 'jan_aushadhi'
                              ? 'bg-amber-600'
                              : 'bg-teal-600'
                          }`}
                        >
                          {clinic.type === 'jan_aushadhi' ? (
                            <Pill className="w-5 h-5" />
                          ) : clinic.isEmergency24x7 ? (
                            <AlertOctagon className="w-5 h-5" />
                          ) : (
                            <Building2 className="w-5 h-5" />
                          )}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-1.5 mb-1">
                            <span
                              className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                clinic.isGovt
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-teal-50 text-teal-800 border border-teal-200'
                              }`}
                            >
                              {clinic.typeLabel}
                            </span>

                            {clinic.badge && (
                              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                                {clinic.badge}
                              </span>
                            )}

                            {clinic.isAyushmanAccepted && (
                              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                                PM-JAY Card Accepted
                              </span>
                            )}
                          </div>

                          <h3 className="font-cultural font-bold text-base sm:text-lg text-[#33332d] leading-snug">
                            {clinic.name}
                          </h3>

                          <div className="flex items-center gap-1 text-xs text-[#66655c] mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span>{clinic.address}</span>
                          </div>
                        </div>
                      </div>

                      {/* Distance Badge & Rating */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold text-xs">
                          <Navigation className="w-3 h-3 text-emerald-600" />
                          <span>{formatDistance(clinic.distanceKm)} away</span>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span className="font-medium text-[11px]">{clinic.timing}</span>
                        </div>
                      </div>
                    </div>

                    {/* Doctor & Timing Info */}
                    <div className="bg-slate-50 rounded-xl p-2.5 mb-3 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Stethoscope className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="font-semibold">{clinic.doctorAvailable}</span>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-700 font-bold shrink-0">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Open & Serving Patients</span>
                      </div>
                    </div>

                    {/* Free Services & Diagnostic Tests Strip */}
                    {clinic.freeServices && clinic.freeServices.length > 0 && (
                      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-2.5 mb-3 text-xs">
                        <div className="font-extrabold text-emerald-900 mb-1 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                          <span>100% Free Health Tests & Facilities:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {clinic.freeServices.map((fs, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 text-[11px] font-medium bg-white text-emerald-800 px-2 py-0.5 rounded-lg border border-emerald-200 shadow-2xs"
                            >
                              <Check className="w-2.5 h-2.5 text-emerald-600" />
                              {fs}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* All Services Tags */}
                    <div className="mb-4">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Key Services:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {clinic.services.map((svc, i) => (
                          <span
                            key={i}
                            className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg font-medium"
                          >
                            {svc}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Interactive Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        {/* Get Directions Button */}
                        <a
                          href={clinic.directionsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 rounded-xl bg-[#5a5a40] hover:bg-[#434330] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
                          title="Open navigation directions in Google Maps"
                        >
                          <Navigation className="w-3.5 h-3.5 text-amber-200" />
                          <span>Get Directions</span>
                          <ExternalLink className="w-3 h-3 opacity-70" />
                        </a>

                        {/* Call Clinic / Helpline Button */}
                        {clinic.phone && (
                          <a
                            href={`tel:${clinic.phone.replace(/[^0-9]/g, '') || '108'}`}
                            className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                            title={`Call ${clinic.phone}`}
                          >
                            <Phone className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{clinic.phone}</span>
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Copy Info Button */}
                        <button
                          onClick={() => handleCopyInfo(clinic)}
                          className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                          title="Copy details to clipboard"
                        >
                          {copiedId === clinic.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700 font-bold">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-500" />
                              <span>Share Info</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Notice */}
        <div className="bg-[#ffffff] px-4 sm:px-6 py-3 border-t border-[#e5e5df] flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0 text-xs text-[#66655c]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              All Primary Health Centres (PHC) & Ayushman Arogya Mandirs offer 100% free basic BP & sugar screening under the National Health Mission (NHM).
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#5a5a40] hover:bg-[#434330] text-white text-xs font-bold cursor-pointer shrink-0"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
