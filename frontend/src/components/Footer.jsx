import { Mail, Phone, MapPin, Heart, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const MinimalFooter = () => {
  return (
    <footer className="bg-gradient-to-br from-[#141414] via-[#003c3c] to-[#143c3c] border-t-2 border-[#a0f000] text-[#ffffff] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-[#003c3c] to-[#143c3c] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-[#a0f000] to-[#003c3c] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#003c3c] to-[#a0f000] text-white shadow-lg">
                <span className="text-xl font-bold">FR</span>
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-[#a0f000] to-[#ffffff] bg-clip-text text-transparent">
                  Fill Rouge Club
                </h3>
                <p className="text-sm text-[#ffffff]/80">Où les champions s'entraînent</p>
              </div>
            </div>
            <p className="text-[#ffffff]/80 text-sm leading-relaxed max-w-md">
              Notre club multisport offre une large gamme d'activités pour tous les âges et tous les niveaux. 
              Rejoignez notre communauté et découvrez votre potentiel sportif.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4 text-[#ffffff]">Liens rapides</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/activities" className="text-[#ffffff]/80 hover:text-[#a0f000] transition-colors duration-200 hover:underline">
                  Consulter les activités
                </a>
              </li>
              <li>
                <a href="/register" className="text-[#ffffff]/80 hover:text-[#a0f000] transition-colors duration-200 hover:underline">
                  Devenir membre
                </a>
              </li>
              <li>
                <a href="/login" className="text-[#ffffff]/80 hover:text-[#a0f000] transition-colors duration-200 hover:underline">
                  Se connecter
                </a>
              </li>
              <li>
                <a href="/contact" className="text-[#ffffff]/80 hover:text-[#a0f000] transition-colors duration-200 hover:underline">
                  Nous contacter
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-[#ffffff]">Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center text-[#ffffff]/80">
                <div className="p-2 bg-gradient-to-r from-[#003c3c] to-[#a0f000] rounded-full mr-3">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <span>contact@fillrouge.com</span>
              </div>
              <div className="flex items-center text-[#ffffff]/80">
                <div className="p-2 bg-gradient-to-r from-[#003c3c] to-[#a0f000] rounded-full mr-3">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <span>+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center text-[#ffffff]/80">
                <div className="p-2 bg-gradient-to-r from-[#003c3c] to-[#a0f000] rounded-full mr-3">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <span>Paris, France</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-[#a0f000]/50 pt-6 mb-6">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-[#ffffff]">Suivez-nous</h4>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-gradient-to-r from-[#003c3c] to-[#a0f000] rounded-full hover:from-[#a0f000] hover:to-[#003c3c] transition-all duration-300 transform hover:scale-110 shadow-lg">
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="p-2 bg-gradient-to-r from-[#003c3c] to-[#a0f000] rounded-full hover:from-[#a0f000] hover:to-[#003c3c] transition-all duration-300 transform hover:scale-110 shadow-lg">
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="p-2 bg-gradient-to-r from-[#003c3c] to-[#a0f000] rounded-full hover:from-[#a0f000] hover:to-[#003c3c] transition-all duration-300 transform hover:scale-110 shadow-lg">
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="p-2 bg-gradient-to-r from-[#003c3c] to-[#a0f000] rounded-full hover:from-[#a0f000] hover:to-[#003c3c] transition-all duration-300 transform hover:scale-110 shadow-lg">
                <Youtube className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-[#a0f000]/50 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-center md:text-left text-[#ffffff]/70 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Fill Rouge Club. Tous droits réservés.
            </p>
            <div className="flex items-center text-[#ffffff]/70 text-sm">
              <span>Fait avec</span>
              <Heart className="w-4 h-4 mx-1 text-red-500 animate-pulse" />
              <span>par l'équipe Fill Rouge</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MinimalFooter;
