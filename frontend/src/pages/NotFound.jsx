import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, Activity, MessageCircle } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EDE9E3] via-[#CBBCA7] to-[#AAAB96] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#AAAB96] to-[#5D6043] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#925B42] to-[#CBBCA7] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-gradient-to-br from-[#5D6043] to-[#AAAB96] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-2xl">
          <div className="inline-block p-8 rounded-3xl bg-white/80 backdrop-blur-lg border border-[#CBBCA7] shadow-2xl mb-8">
            <div className="text-8xl mb-6">🔍</div>
            <h1 className="text-6xl font-black bg-gradient-to-r from-[#5D6043] via-[#925B42] to-[#AAAB96] bg-clip-text text-transparent mb-4">
              404
            </h1>
            <h2 className="text-3xl font-bold text-[#5D6043] mb-4">
              Page Non Trouvée
            </h2>
            <p className="text-[#5D6043]/80 text-lg mb-8">
              Oups ! La page que vous recherchez n'existe pas ou a été déplacée.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-[#AAAB96] to-[#925B42] text-white px-8 py-3 rounded-xl font-semibold hover:from-[#925B42] hover:to-[#AAAB96] transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Retour à l'Accueil
              </button>
              <button
                onClick={() => navigate(-1)}
                className="bg-[#CBBCA7] text-[#5D6043] px-8 py-3 rounded-xl font-semibold hover:bg-[#AAAB96] transition-all duration-300 transform hover:scale-105 border border-[#AAAB96]"
              >
                Page Précédente
              </button>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-[#CBBCA7]">
            <h3 className="text-xl font-bold text-[#5D6043] mb-4">Que pouvez-vous faire ?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="inline-flex p-4 bg-gradient-to-r from-[#EDE9E3] to-[#CBBCA7] rounded-full mb-4">
                  <Home className="w-6 h-6 text-[#AAAB96]" />
                </div>
                <h4 className="font-semibold text-[#5D6043] mb-2">Accueil</h4>
                <p className="text-[#5D6043]/80 text-sm">
                  Retournez à la page principale
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex p-4 bg-gradient-to-r from-[#CBBCA7] to-[#AAAB96] rounded-full mb-4">
                  <Activity className="w-6 h-6 text-[#925B42]" />
                </div>
                <h4 className="font-semibold text-[#5D6043] mb-2">Activités</h4>
                <p className="text-[#5D6043]/80 text-sm">
                  Découvrez nos activités
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex p-4 bg-gradient-to-r from-[#AAAB96] to-[#5D6043] rounded-full mb-4">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-[#5D6043] mb-2">Contact</h4>
                <p className="text-[#5D6043]/80 text-sm">
                  Contactez-nous pour de l'aide
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 