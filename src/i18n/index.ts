import { SupportedLocale, TranslationDictionary } from './types.js';

export const LOCALES: Record<SupportedLocale, TranslationDictionary> = {
  en: {
    tagline: 'Make the code fit the project.',
    initSuccess: 'Tailor initialized successfully with project constitution and memory layer.',
    specCreated: 'Feature specification created successfully in specs directory.',
    planGenerated: 'Technical plan generated with pre-execution reuse audit.',
    tasksGenerated: 'Granular actionable tasks generated.',
    syncSuccess: 'AI coding agent adapters synchronized successfully.',
    securityPass: 'Zero security vulnerabilities or credential leaks detected.',
    securityFail: 'Security violations detected; remediation required.',
    reuseFound: 'Existing reusable component or utility discovered in workspace.',
    doctorHealthy: 'All Tailor diagnostic checks passed cleanly.',
  },
  es: {
    tagline: 'Haz que el código se adapte al proyecto.',
    initSuccess: 'Tailor inicializado con éxito con la constitución del proyecto y memoria.',
    specCreated: 'Especificación de funcionalidad creada con éxito en el directorio specs.',
    planGenerated: 'Plan técnico generado con auditoría previa de reutilización.',
    tasksGenerated: 'Tareas granulares procesables generadas.',
    syncSuccess: 'Adaptadores de agentes de IA sincronizados con éxito.',
    securityPass: 'Cero vulnerabilidades de seguridad o fugas de credenciales.',
    securityFail: 'Violaciones de seguridad detectadas; se requiere remediación.',
    reuseFound: 'Componente o utilidad reutilizable existente descubierto en el espacio de trabajo.',
    doctorHealthy: 'Todas las comprobaciones de diagnóstico de Tailor pasaron limpiamente.',
  },
  zh: {
    tagline: '让代码贴合项目架构与纪律。',
    initSuccess: 'Tailor 初始化成功，已生成项目宪法与分层记忆。',
    specCreated: '功能规格说明书已成功在 specs 目录下创建。',
    planGenerated: '技术实现计划已生成，并包含前置复用审计。',
    tasksGenerated: '细粒度可执行任务清单已生成。',
    syncSuccess: '所有 AI 编程助手适配器已成功同步。',
    securityPass: '未检测到安全漏洞或密钥泄露。',
    securityFail: '检测到安全违规项，需要立即整改。',
    reuseFound: '在当前代码库中发现可直接复用的现有组件或工具函数。',
    doctorHealthy: 'Tailor 所有健康诊断检查全部通过。',
  },
  ja: {
    tagline: 'コードをプロジェクトに完璧に仕立てる。',
    initSuccess: 'Tailor の初期化が成功しました（プロジェクト憲法とメモリ層を構築）。',
    specCreated: '機能仕様書が specs ディレクトリに作成されました。',
    planGenerated: '再利用監査を含む技術実装計画が生成されました。',
    tasksGenerated: '詳細なタスクリストが生成されました。',
    syncSuccess: 'AIエージェントのアダプターが正常に同期されました。',
    securityPass: 'セキュリティ脆弱性やシークレットの漏洩は検出されませんでした。',
    securityFail: 'セキュリティ違反が検出されました。修正が必要です。',
    reuseFound: 'ワークスペース内で再利用可能な既存のコンポーネントまたはユーティリティが見つかりました。',
    doctorHealthy: 'すべての Tailor 診断チェックに合格しました。',
  },
  de: {
    tagline: 'Lass den Code zum Projekt passen.',
    initSuccess: 'Tailor erfolgreich mit Projektverfassung und Memory-Layer initialisiert.',
    specCreated: 'Funktionsspezifikation erfolgreich im specs-Verzeichnis erstellt.',
    planGenerated: 'Technischer Plan mit vorherigem Wiederverwendungs-Audit erstellt.',
    tasksGenerated: 'Granulare, ausführbare Aufgabenliste erstellt.',
    syncSuccess: 'AI-Coding-Agent-Adapter erfolgreich synchronisiert.',
    securityPass: 'Keine Sicherheitslücken oder kompromittierten Anmeldedaten erkannt.',
    securityFail: 'Sicherheitsverstöße erkannt; Behebung erforderlich.',
    reuseFound: 'Vorhandene wiederverwendbare Komponente oder Hilfsfunktion im Arbeitsbereich entdeckt.',
    doctorHealthy: 'Alle Tailor-Diagnoseprüfungen erfolgreich bestanden.',
  },
  hi: {
    tagline: 'कोड को प्रोजेक्ट के अनुरूप बनाएं।',
    initSuccess: 'Tailor सफलतापूर्वक प्रोजेक्ट संविधान और मेमोरी लेयर के साथ प्रारंभ हुआ।',
    specCreated: 'फीचर विनिर्देश specs निर्देशिका में सफलतापूर्वक बनाया गया।',
    planGenerated: 'पुन: उपयोग ऑडिट के साथ तकनीकी योजना तैयार की गई।',
    tasksGenerated: 'कार्रवाई योग्य कार्य सूची तैयार की गई।',
    syncSuccess: 'AI कोडिंग एजेंट एडेप्टर सफलतापूर्वक सिंक्रनाइज़ किए गए।',
    securityPass: 'कोई सुरक्षा भेद्यता या क्रेडेंशियल लीक नहीं मिला।',
    securityFail: 'सुरक्षा उल्लंघन मिले; सुधार आवश्यक है।',
    reuseFound: 'कार्यक्षेत्र में मौजूदा पुन: प्रयोज्य घटक या उपयोगिता मिली।',
    doctorHealthy: 'Tailor के सभी नैदानिक परीक्षण सफलतापूर्वक पास हुए।',
  },
};

export function getTranslation(key: keyof TranslationDictionary, locale: SupportedLocale = 'en'): string {
  const dict = LOCALES[locale] || LOCALES.en;
  return dict[key] || LOCALES.en[key] || key;
}

export function detectLocale(): SupportedLocale {
  const envLang = process.env.LANG || process.env.LC_ALL || process.env.LANGUAGE || '';
  const prefix = envLang.toLowerCase().slice(0, 2);
  if (prefix === 'es') return 'es';
  if (prefix === 'zh') return 'zh';
  if (prefix === 'ja') return 'ja';
  if (prefix === 'de') return 'de';
  if (prefix === 'hi') return 'hi';
  return 'en';
}
