import { Mail, Phone, MapPin } from "lucide-react"

const MinimalFooter = () => {
  return (
    <footer className="bg-white border-t-2 border-orange-400 text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
   
          <div>
            <h3 className="font-semibold text-lg mb-3 text-orange-600">À propos de nous</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Notre club multisport offre une large gamme d'activités pour tous les âges et tous les niveaux.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3 text-teal-600">Liens rapides</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/activities" className="text-gray-600 hover:text-orange-600 transition-colors">
                  Activités
                </a>
              </li>
              <li>
                <a href="/register" className="text-gray-600 hover:text-orange-600 transition-colors">
                  Devenir membre
                </a>
              </li>
              <li>
                <a href="/login" className="text-gray-600 hover:text-orange-600 transition-colors">
                  Connexion
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-600 hover:text-orange-600 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3 text-purple-600">Contact</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <Mail className="w-4 h-4 mr-2 text-orange-500" />
                <span>contact@clubmultisport.com</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-2 text-teal-500" />
                <span>+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-purple-500" />
                <span>Paris, France</span>
              </div>
            </div>
          </div>
        </div>


        <div className="border-t border-gray-200 pt-4">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Club Multisport. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default MinimalFooter
