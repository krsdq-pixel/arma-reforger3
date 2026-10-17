export interface TranslationDictionary {
  brandTitle: string;
  brandSubtitle: string;
  fcsButton: string;
  fcsButtonShort: string;
  settingsButton: string;
  weatherButton: string;
  rulerButton: string;
  rulerActiveNotice: string;
  rulerClear: string;
  rulerTotalDistance: string;
  rulerBearing: string;
  addCustomMarkerButton: string;
  customMarkerModalTitle: string;
  markerName: string;
  markerCategory: string;
  markerNotes: string;
  markerColor: string;
  saveMarker: string;
  deleteMarker: string;
  cancel: string;
  close: string;
  reset: string;
  apply: string;
  readyToFire: string;
  outOfRange: string;
  optimalCharge: string;
  targetDist: string;
  slantDist: string;
  timeOfFlight: string;
  deltaAlt: string;
  peakAlt: string;
  deltaHw: string;
  impactAngle: string;
  azimuth: string;
  elevation: string;
  mils: string;
  degrees: string;
  copyMission: string;
  copiedMission: string;
  weatherTitle: string;
  weatherDisclaimer: string;
  windSpeed: string;
  windDirection: string;
  windUnit: string;
  weatherSource: string;
  manualObservation: string;
  settingsTitle: string;
  restoreDefaults: string;
  confirmResetTitle: string;
  confirmResetMsg: string;
  settingsCategories: {
    general: string;
    mapAppearance: string;
    mapLabels: string;
    markers: string;
    mortarConfig: string;
    weather: string;
    measurementUnits: string;
    language: string;
    interfaceLayout: string;
    interfaceVisibility: string;
    storagePrivacy: string;
    importExport: string;
    resetRecovery: string;
  };
  visibility: {
    title: string;
    description: string;
    quickActions: string;
    mapOnly: string;
    hideAll: string;
    showAll: string;
    restoreDefaults: string;
    componentsTitle: string;
    showHeader: string;
    showTerrainTabs: string;
    showMobileTabs: string;
    showLiveSolutionPill: string;
    showMapTypeSelector: string;
    showMarkerControls: string;
    showMapTools: string;
    showFcsButton: string;
    showSettingsButton: string;
    showZoomControls: string;
    showBottomCoordinatesHud: string;
    menuPosition: string;
    menuSize: string;
    threeDotTooltip: string;
    threeDotTitle: string;
    openFullSettings: string;
    closeMenu: string;
  };
  storage: {
    description: string;
    siteDataNotice: string;
    exportButton: string;
    importButton: string;
    clearStorageButton: string;
    clearPreferencesOnly: string;
    clearUserDataOnly: string;
    clearSuccess: string;
    exportSuccess: string;
    importSuccess: string;
    importError: string;
  };
  mortar: {
    americanName: string;
    russianName: string;
    minElevation: string;
    maxElevation: string;
    angularSystem: string;
    verificationStatus: string;
    requiresVerification: string;
    sourceInfo: string;
    customMortars: string;
    addCustomMortar: string;
    duplicate: string;
    delete: string;
    decimalPrecision: string;
    angularFormat: string;
  };
}

export const TRANSLATIONS: Record<'en' | 'ar', TranslationDictionary> = {
  en: {
    brandTitle: 'Arma Reforger FCS',
    brandSubtitle: 'Tactical Artillery Planner & Fire Control System',
    fcsButton: 'Calculator & Solution',
    fcsButtonShort: 'FCS',
    settingsButton: 'Settings & Customization',
    weatherButton: 'Weather & Wind',
    rulerButton: 'Measure Distance',
    rulerActiveNotice: 'Measurement active: Click on map to add waypoints',
    rulerClear: 'Clear Ruler',
    rulerTotalDistance: 'Total Distance',
    rulerBearing: 'Azimuth / Bearing',
    addCustomMarkerButton: 'Add Tactical Marker',
    customMarkerModalTitle: 'Create Custom Tactical Marker',
    markerName: 'Marker Name',
    markerCategory: 'Category',
    markerNotes: 'Operational Notes',
    markerColor: 'Marker Color',
    saveMarker: 'Place Marker',
    deleteMarker: 'Delete Marker',
    cancel: 'Cancel',
    close: 'Close',
    reset: 'Reset to Defaults',
    apply: 'Apply',
    readyToFire: '● READY TO FIRE',
    outOfRange: '▲ OUT OF RANGE',
    optimalCharge: 'Optimal Charge Ring',
    targetDist: 'Target Distance',
    slantDist: 'Slant Distance',
    timeOfFlight: 'Time of Flight',
    deltaAlt: 'Delta Altitude (ΔH)',
    peakAlt: 'Peak Altitude (Ys)',
    deltaHw: 'ΔHw (per 100m)',
    impactAngle: 'Impact Angle',
    azimuth: 'Azimuth',
    elevation: 'Elevation (Tube)',
    mils: 'mils',
    degrees: 'deg',
    copyMission: 'Copy Fire Mission',
    copiedMission: 'Copied Mission!',
    weatherTitle: 'Weather & Wind Observation',
    weatherDisclaimer: 'Manual user-entered observation. Does not alter in-game ballistics unless supported by verified game integration.',
    windSpeed: 'Wind Speed',
    windDirection: 'Wind Direction',
    windUnit: 'Speed Unit',
    weatherSource: 'Data Source',
    manualObservation: 'Manual Observation',
    settingsTitle: 'System Settings & Customization',
    restoreDefaults: 'Restore Default Settings',
    confirmResetTitle: 'Confirm Reset',
    confirmResetMsg: 'Are you sure you want to reset settings? Your custom markers will be preserved.',
    settingsCategories: {
      general: '1. General Settings',
      mapAppearance: '2. Map Appearance',
      mapLabels: '3. Map Labels & Text',
      markers: '4. Markers & Locations',
      mortarConfig: '5. Mortar Configuration',
      weather: '6. Weather & Wind Display',
      measurementUnits: '7. Measurement Units',
      language: '8. Language & Translation',
      interfaceLayout: '9. Interface Layout & Docking',
      interfaceVisibility: '10. Interface Visibility & Controls',
      storagePrivacy: '11. Data Storage & Privacy',
      importExport: '12. Import & Export',
      resetRecovery: '13. Reset & Recovery',
    },
    visibility: {
      title: 'Interface Element Visibility',
      description: 'Control the display of every individual screen element. Start in clean map-only mode or toggle specific headers, panels, and tools.',
      quickActions: 'Quick Display Presets',
      mapOnly: 'Map Only (Clean View)',
      hideAll: 'Hide All Optional Elements',
      showAll: 'Show All Interface Elements',
      restoreDefaults: 'Restore Default Visibility',
      componentsTitle: 'Individual Element Visibility Toggles',
      showHeader: 'Application Header & Brand Bar',
      showTerrainTabs: 'Map Selection Tabs (Everon, Arland, Kolguyev)',
      showMobileTabs: 'Tactical Map & Calculator Mobile Tabs',
      showLiveSolutionPill: 'Live Azimuth / Elevation / Ring Info Display',
      showMapTypeSelector: 'Map Layer Selector (Topo / Sat / Drawn)',
      showMarkerControls: 'Gun, Target & Tactical Marker Tools',
      showMapTools: 'Measurement, Reset & Weather Tools',
      showFcsButton: 'Fire Control System (FCS) Button',
      showSettingsButton: 'Settings Button on Map Toolbar',
      showZoomControls: 'Zoom-in & Zoom-out Controls (+ / -)',
      showBottomCoordinatesHud: 'Bottom Coordinates & Grid HUD',
      menuPosition: 'Three-Dot Menu Position',
      menuSize: 'Three-Dot Menu Size',
      threeDotTooltip: 'Quick Settings & Visibility Menu',
      threeDotTitle: 'Quick Tactical Controls',
      openFullSettings: 'Open All Settings',
      closeMenu: 'Close Menu',
    },
    storage: {
      description: 'Application data is stored strictly in your browser local storage. No external servers or cloud accounts are used.',
      siteDataNotice: 'Important: Clearing browser site data or clearing cache will erase locally stored settings and custom markers unless you export them first.',
      exportButton: 'Export Settings & Data (JSON)',
      importButton: 'Import Backup File (JSON)',
      clearStorageButton: 'Factory Reset (Clear All Data)',
      clearPreferencesOnly: 'Reset UI Preferences Only',
      clearUserDataOnly: 'Clear Custom Markers & Mortars',
      clearSuccess: 'Selected local storage data has been cleared.',
      exportSuccess: 'Backup configuration exported successfully.',
      importSuccess: 'Backup imported and applied successfully.',
      importError: 'Invalid backup file format. Please check the JSON file schema.',
    },
    mortar: {
      americanName: 'M252 81mm Mortar (US)',
      russianName: '2B14 Podnos 82mm Mortar (RU)',
      minElevation: 'Minimum Elevation',
      maxElevation: 'Maximum Elevation',
      angularSystem: 'Angular System',
      verificationStatus: 'Data Verification Status',
      requiresVerification: 'Requires verification against the existing game implementation',
      sourceInfo: 'Source Information',
      customMortars: 'User-Defined Mortar Records',
      addCustomMortar: 'Add Custom Mortar Record',
      duplicate: 'Duplicate',
      delete: 'Delete',
      decimalPrecision: 'Decimal Precision',
      angularFormat: 'Angular Display Format',
    },
  },
  ar: {
    brandTitle: 'منظومة إدارة النيران Arma Reforger',
    brandSubtitle: 'مخطط المدفعية التكتيكي ومنظومة إدارة النيران (FCS)',
    fcsButton: 'حاسبة الرماية والحل الباليستي',
    fcsButtonShort: 'الحاسبة',
    settingsButton: 'الإعدادات والتخصيص',
    weatherButton: 'الطقس والرياح',
    rulerButton: 'قياس المسافة',
    rulerActiveNotice: 'أداة القياس مفعلة: انقر فوق الخريطة لإضافة نقاط القياس',
    rulerClear: 'مسح القياس',
    rulerTotalDistance: 'المسافة الإجمالية',
    rulerBearing: 'زاوية الاتجاه / السمت',
    addCustomMarkerButton: 'إضافة علامة تكتيكية',
    customMarkerModalTitle: 'إنشاء علامة تكتيكية مخصصة',
    markerName: 'اسم العلامة',
    markerCategory: 'التصنيف',
    markerNotes: 'ملاحظات عملياتية',
    markerColor: 'لون العلامة',
    saveMarker: 'تثبيت العلامة',
    deleteMarker: 'حذف العلامة',
    cancel: 'إلغاء',
    close: 'إغلاق',
    reset: 'استعادة الافتراضيات',
    apply: 'تطبيق',
    readyToFire: '● جاهز للإطلاق',
    outOfRange: '▲ خارج المدى',
    optimalCharge: 'حلقة الدفع المثلى',
    targetDist: 'المسافة للهدف',
    slantDist: 'المسافة المائلة',
    timeOfFlight: 'زمن التحليق',
    deltaAlt: 'فرق الارتفاع (ΔH)',
    peakAlt: 'أقصى ارتفاع (Ys)',
    deltaHw: 'معامل التصحيح (ΔHw)',
    impactAngle: 'زاوية السقوط',
    azimuth: 'زاوية السمت',
    elevation: 'زاوية الارتفاع (الماسورة)',
    mils: 'مل',
    degrees: 'درجة',
    copyMission: 'نسخ أمر الرماية',
    copiedMission: 'تم نسخ أمر الرماية!',
    weatherTitle: 'رصد الطقس واتجاه الرياح',
    weatherDisclaimer: 'بيانات رصد يدوية من المستخدم. لا تغير الخصائص الباليستية ما لم تدعمها بيانات اللعبة المعتمدة.',
    windSpeed: 'سرعة الرياح',
    windDirection: 'اتجاه الرياح',
    windUnit: 'وحدة السرعة',
    weatherSource: 'مصدر البيانات',
    manualObservation: 'رصد يدوي ميداني',
    settingsTitle: 'إعدادات المنظومة والتخصيص الشامل',
    restoreDefaults: 'استعادة الإعدادات الافتراضية',
    confirmResetTitle: 'تأكيد إعادة الضبط',
    confirmResetMsg: 'هل أنت متأكد من رغبتك في إعادة ضبط الواجهة؟ سيتم الاحتفاظ بعلاماتك المخصصة.',
    settingsCategories: {
      general: '١. الإعدادات العامة',
      mapAppearance: '٢. مظهر الخارطة',
      mapLabels: '٣. تسميات ونصوص الخارطة',
      markers: '٤. العلامات والمواقع التكتيكية',
      mortarConfig: '٥. تهيئة منظومات الهاون',
      weather: '٦. عرض الطقس والرياح',
      measurementUnits: '٧. وحدات القياس',
      language: '٨. اللغة والترجمة',
      interfaceLayout: '٩. تخطيط الواجهة والقوائم',
      interfaceVisibility: '١٠. رؤية واجهة المستخدم والتحكم',
      storagePrivacy: '١١. تخزين البيانات والخصوصية',
      importExport: '١٢. استيراد وتصدير البيانات',
      resetRecovery: '١٣. إعادة الضبط والتعافي',
    },
    visibility: {
      title: 'التحكم في رؤية عناصر واجهة المستخدم',
      description: 'تحكم كامل في إظهار أو إخفاء كل عنصر من عناصر الشاشة. ابدأ في وضع الخريطة النظيفة فقط أو أظهر الأشرطة والأدوات حسب الرغبة.',
      quickActions: 'إجراءات سريعة لتغيير وضع العرض',
      mapOnly: 'الخارطة فقط (عرض نظيف بدون أشرطة)',
      hideAll: 'إخفاء كافة عناصر الواجهة الإضافية',
      showAll: 'إظهار كافة عناصر الواجهة التكتيكية',
      restoreDefaults: 'استعادة وضع الرؤية الافتراضي',
      componentsTitle: 'مفاتيح إظهار/إخفاء العناصر بشكل فردي',
      showHeader: 'شريط العنوان وشعار المنظومة العلوي',
      showTerrainTabs: 'ألسنة اختيار الخارطة (إيفرون، أرلاند، كولغويف)',
      showMobileTabs: 'ألسنة التبديل التكتيكية للأجهزة المحمولة',
      showLiveSolutionPill: 'شريط قراءة الرماية المباشرة (السمت/الارتفاع/الحلقة)',
      showMapTypeSelector: 'محدد نوع الخارطة (طبوغرافي / قمر صناعي / رسم)',
      showMarkerControls: 'أدوات تحديد مواقع المدفع والهدف والعلامات',
      showMapTools: 'أدوات القياس والمسطرة وتوسيط المهمة والطقس',
      showFcsButton: 'زر لوحة حاسبة إدارة النيران (FCS)',
      showSettingsButton: 'زر الإعدادات على شريط أدوات الخارطة',
      showZoomControls: 'أزرار التكبير والتصغير (+ / -)',
      showBottomCoordinatesHud: 'شريط إحداثيات الماوس والشبكة أسفل الشاشة',
      menuPosition: 'موقع زر القائمة ثلاثية النقاط',
      menuSize: 'حجم زر القائمة ثلاثية النقاط',
      threeDotTooltip: 'قائمة الإعدادات والرؤية السريعة',
      threeDotTitle: 'التحكم التكتيكي السريع',
      openFullSettings: 'فتح لوحة الإعدادات الشاملة',
      closeMenu: 'إغلاق القائمة',
    },
    storage: {
      description: 'يتم حفظ جميع بيانات التطبيق محلياً وبشكل حصري في ذاكرة التخزين المحلية للمتصفح دون استخدام أي خوادم خارجية.',
      siteDataNotice: 'تنبيه هام: مسح بيانات الموقع أو ذاكرة التخزين المؤقت للمتصفح سيؤدي إلى مسح الإعدادات والعلامات المحفوظة ما لم تقم بتصدير نسخة احتياطية.',
      exportButton: 'تصدير الإعدادات والبيانات (ملف JSON)',
      importButton: 'استيراد ملف النسخة الاحتياطية (JSON)',
      clearStorageButton: 'إعادة ضبط المصنع (مسح شامل للبيانات)',
      clearPreferencesOnly: 'إعادة ضبط مظهر الواجهة فقط',
      clearUserDataOnly: 'مسح العلامات والهاونات المخصصة',
      clearSuccess: 'تم مسح البيانات المحددة من المتصفح بنجاح.',
      exportSuccess: 'تم تصدير ملف النسخة الاحتياطية بنجاح.',
      importSuccess: 'تم استيراد النسخة الاحتياطية وتطبيقها بنجاح.',
      importError: 'صيغة ملف النسخة الاحتياطية غير صالحة. يرجى التحقق من الملف.',
    },
    mortar: {
      americanName: 'هاون M252 عيار 81 ملم (أمريكي)',
      russianName: 'هاون 2B14 بودنس عيار 82 ملم (روسي)',
      minElevation: 'الحد الأدنى للارتفاع',
      maxElevation: 'الحد الأقصى للارتفاع',
      angularSystem: 'نظام قياس الزوايا',
      verificationStatus: 'حالة التحقق من البيانات',
      requiresVerification: 'يتطلب التحقق من مطابقة الحسابات مع التطبيق الفعلي داخل لعبة Arma Reforger',
      sourceInfo: 'المعلومات المرجعية للمصدر',
      customMortars: 'سجلات الهاون المخصصة للمستخدم',
      addCustomMortar: 'إضافة سجل هاون مخصص',
      duplicate: 'نسخ السجل',
      delete: 'حذف',
      decimalPrecision: 'دقة المنازل العشرية',
      angularFormat: 'صيغة عرض الزوايا',
    },
  },
};
