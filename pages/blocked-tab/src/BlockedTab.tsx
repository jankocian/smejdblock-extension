import { withErrorBoundary, withSuspense } from '@chrome-extension-boilerplate/shared';

const BlockedTab = () => {
  return (
    <main className="bg-red-100 min-h-screen py-20 px-6">
      <div className="w-full p-8 md:p-16 max-w-[600px] mx-auto text-slate-700 bg-white rounded-3xl shadow-lg text-lg">
        <img src={chrome.runtime.getURL('blocked-tab/logo.png')} className="w-28 mb-6" alt="ŠmejdBlock Logo" />

        <div className="flex flex-col gap-y-3">
          <h1 className="text-xl md:text-2xl font-semibold mb-3 text-red-600">Riziková stránka zablokována</h1>
          <p>
            Rozšíření ŠmejdBlock zablokovalo tuto stránku, protože se nachází na{' '}
            <a
              href="https://www.coi.cz/pro-spotrebitele/rizikove-e-shopy/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-red-600 hover:text-red-700">
              seznamu rizikových e-shopů
            </a>{' '}
            České obchodní inspekce či{' '}
            <a
              href="https://www.sukl.cz/leciva/webove-stranky-s-nelegalnimi-nabidkami-leciv"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-red-600 hover:text-red-700">
              stránek s&nbsp;nelegálními nabídkami léčiv
            </a>{' '}
            Státního ústavu pro kontrolu léčiv.
          </p>
          <p>
            Tyto webové stránky se vyznačují převedším nedodržováním zákonných povinností a obtížnou vymahatelností
            spotřebitelských práv. Nabízené přípravky bývají neschválené či bez ověřené kvality a účinnosti.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <button
            onClick={() => window.history.go(-2)}
            className="border border-red-600 text-red-600 hover:text-red-700 rounded-md px-6 py-3 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            Zpět na předchozí stránku
          </button>
          <a
            href="https://smejdblock.cz"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-700 text-white px-6 py-3 rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            Více informací
          </a>
        </div>
      </div>
    </main>
  );
};

export default withErrorBoundary(withSuspense(BlockedTab, <div> Načítám... </div>), <div> Error </div>);
