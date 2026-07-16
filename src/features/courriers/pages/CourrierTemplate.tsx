'use client'

import { useEffect, useRef, useState, useCallback} from 'react'
import { useCourrier } from '../hooks/useCourrier'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { Courrier, MessageCourrier } from '../types/courrier'
import { CourrierListView } from '../components/list/CourrierListView'
import { MessageListView } from '../components/list/MessageListView'
import { MessageDetailView } from '../components/MessageDetailView'
import { useMercureSubscription } from '@/hooks/useMercureSubscription'
import { useNotifications } from '@/hooks/useNotifications'
import { useCloturer } from '../hooks/useCloturer'
import { User } from '@/features/auth/types/login'

type Step =
  | { level: 'courriers' }
  | { level: 'messages'; courrier: Courrier }
  | { level: 'detail'; courrier: Courrier; message: MessageCourrier }

interface CourrierTemplateProps {
  initialCourrier?: Courrier
  isRecherche?: boolean
}

export const CourrierTemplate = ({ initialCourrier, isRecherche }: CourrierTemplateProps = {}) => {
  const { user } = useCurrentUser();
  const currentUserId = user?.id;
  const nbLimitCourrier = process.env.NEXT_PUBLIC_NB_LIMIT_COURRIERS ? parseInt(process.env.NEXT_PUBLIC_NB_LIMIT_COURRIERS) : 2;
  const nbLimitMessage = process.env.NEXT_PUBLIC_NB_LIMIT_MESSAGES ? parseInt(process.env.NEXT_PUBLIC_NB_LIMIT_MESSAGES) : 2;
  const { addNotification } = useNotifications();

  const {
    courriers,
    messages,
    loading,
    error,
    fetchCourriersByUser,
    fetchMessages,
    setCourriers,
    setMessages,
    updateHistorique,
    getNbNonTraite
  } = useCourrier();
  
  const [step, setStep] = useState<Step>(
    initialCourrier 
      ? { level: 'messages', courrier: initialCourrier }
      : { level: 'courriers' }
  );
  const [nbNonTraiteState, setNbNonTraiteState] = useState(0);
  
  // États de pagination distincts
  const [hasMoreCourriers, setHasMoreCourriers] = useState(true);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isTraiterAt, setIsTraiterAt] = useState<boolean | null>(null);
  const stepRef = useRef(step);
  useEffect(() => { stepRef.current = step }, [step]);

  // --- LOGIQUE COURRIERS ---

  useEffect(() => {
    const initCourriers = async () => {
      const data = await fetchCourriersByUser(undefined, isTraiterAt);
      if (data && data.length < nbLimitCourrier) setHasMoreCourriers(false);
    };
    const nonTraiter = getNbNonTraite();
    initCourriers();
    nonTraiter.then(stat => setNbNonTraiteState(stat.nonTraite));
  }, [fetchCourriersByUser, isTraiterAt]);
 

  const loadMoreCourriers = async () => {
    if (loading || !hasMoreCourriers) return;
    const lastDate = courriers[courriers.length - 1]?.createdAt;
    if (lastDate) {
      const newItems = await fetchCourriersByUser(lastDate,isTraiterAt);
      if (!newItems || newItems.length < nbLimitCourrier) setHasMoreCourriers(false);
    }
  };

  // --- LOGIQUE MESSAGES ---

  const currentCourrierId = (step.level === 'messages' || step.level === 'detail') 
    ? step.courrier.id 
    : null;

  // Chargement initial des messages quand on change de courrier
  useEffect(() => {
    if (currentCourrierId) {
      const initMessages = async () => {
        setHasMoreMessages(true); // Reset pour le nouveau courrier
        const data = await fetchMessages(currentCourrierId);
        if (data && data.length < nbLimitMessage) setHasMoreMessages(false);
      };
      initMessages();
    }
  }, [currentCourrierId, fetchMessages]);


  const loadMoreMessages = async () => {
    if (loading || !hasMoreMessages || !currentCourrierId) return;
    // On prend la date du message le plus ancien (le dernier du tableau)
    const lastMsgDate = messages[messages.length - 1]?.createdAt;
    if (lastMsgDate) {
      const newMsgs = await fetchMessages(currentCourrierId, lastMsgDate);
      if (!newMsgs || newMsgs.length < nbLimitMessage) setHasMoreMessages(false);
    }
  };
  const handleMessageRead = (messageId: number) => {
    const isMarkingUnread = messageId === 0;
    
    setStep((prev) => {
      // 1. On vérifie si on est bien dans le mode 'detail'
      if (prev.level !== 'detail') {
        return prev;
      }

      // Ici, TypeScript sait que prev est de type { level: 'detail', courrier: ..., message: ... }
      const targetId = isMarkingUnread ? prev.message.id : messageId;
      const newReadDate = isMarkingUnread ? null : new Date().toISOString();

      // 2. On met à jour la liste globale (setMessages est indépendant du step)
      setMessages((prevMsgs) =>
        prevMsgs.map((m) => (m.id === targetId ? { ...m, isReadAt: newReadDate } : m))
      );

      // 3. On retourne le nouvel état du step
      return {
        ...prev,
        message: { ...prev.message, isReadAt: newReadDate },
      };
    });
  };

  // --- CONFIGURATION MERCURE ---

  // Topic "message" : nouveau transfert reçu
  const handleTransfert = useCallback((incomingData: MessageCourrier) => {
    const courrierConcerne = incomingData.courrier;
    

    // Vérifier si l'utilisateur actuel est le destinataire du message
    // const estPourMoi = incomingData.destinataire?.id=== currentUserId || incomingData.expediteur?.id=== currentUserId;
    const estPourMoi = incomingData.destinataire?.id=== currentUserId;

    // NOTIFICATION : Nouveau message reçu
    if (estPourMoi) {
      setNbNonTraiteState(prev => prev + 1);
      addNotification(
        `📬 Nouveau message reçu - ${courrierConcerne.object}`,
        `De: ${incomingData.expediteur?.nom || 'Expéditeur'} - ${incomingData.observation?.substring(0, 50) || 'Contenu du message...'}`,
        'success', // 'success' pour les messages qui me sont destinés
        { courrierId: courrierConcerne.id, messageId: incomingData.id, isForMe: true }
      );
    

      // 1. Mise à jour de la liste des courriers (inchangé)
      setCourriers?.((prev) => {    
          return [courrierConcerne, ...prev];
      });
    }

    // 2. Logique d'affichage des messages
    const current = stepRef.current;
    const isViewingThisCourrier =
      (current.level === 'messages' || current.level === 'detail') &&
      Number(current.courrier.id) === Number(courrierConcerne.id);

    if (isViewingThisCourrier) {
      // Met à jour l'état du courrier actuel (clôture etc.)
      setStep(prev => prev.level !== 'courriers'
        ? { ...prev, courrier: { ...prev.courrier, cloturePar: courrierConcerne.cloturePar } }
        : prev
      );
      
      // NOUVEAU : On insère le message directement en haut de la liste !
      setMessages?.(prevMsgs => {
        // Sécurité : on vérifie que le message n'est pas déjà dans la liste
        const alreadyExists = prevMsgs.some(m => Number(m.id) === Number(incomingData.id));
        if (alreadyExists) return prevMsgs;

        // On place incomingData (le nouveau message) en position 0
        return [incomingData, ...prevMsgs];
      });
    }
    
    // N'oubliez pas d'ajouter setMessages dans les dépendances du useCallback
  }, [setCourriers, setMessages, addNotification,currentUserId]);

  // Topic "lectureMessage" : marquage lu/non lu en temps réel
  const handleLecture = useCallback((data: { id: number; courrier :Courrier;isReadAt: string | null }) => {
    setCourriers(prev => prev.map(m => m.id === data.courrier.id ? { ...m, isReadAt: data.isReadAt } : m));
    setMessages(prev => prev.map(m => m.id === data.id ? { ...m, isReadAt: data.isReadAt } : m));
    setStep(prev => {
       if (prev.level === 'messages' && prev.courrier.id === data.courrier.id) {
        return { ...prev, courrier: { ...prev.courrier, isReadAt: data.isReadAt } };
      }
      if (prev.level === 'detail' && prev.message.id === data.id) {
        return { ...prev, message: { ...prev.message, isReadAt: data.isReadAt } };
      }
      return prev;
    });
  }, [setMessages]);

 const handleCloturer = useCallback((data: { id: number; cloturePar: User | null }) => {
  setCourriers(prev => prev.map(m => m.id === data.id ? { ...m, cloturePar: data.cloturePar } : m));
  setStep(prev => prev.level !== 'courriers'
    ? { ...prev, courrier: { ...prev.courrier, cloturePar: data.cloturePar } }
    : prev
  );
}, [setCourriers, setStep]);
  
  // 1. Appeler le hook au niveau supérieur de votre composant
const { cloturer } =  useCloturer();

const handleLocalCloturation = useCallback(async (id: number) => {
    try {
      // 3. Exécuter la fonction asynchrone
      const { success, courrier } = await cloturer(id);
  
      // 4. (Optionnel mais recommandé) Vérifier le succès avant de mettre à jour l'état
      if (success && courrier) {
        setCourriers(prev => 
          prev.map(m => m.id === id ? { ...m, cloturePar: courrier.cloturePar } : m)
        );
        setStep({ level: 'courriers' });
        
      }
     
    } catch (err) {
      console.error("Erreur lors de la clôture :", err);
    }
    
  // 5. Ne pas oublier d'ajouter 'cloturer' dans le tableau des dépendances
}, [cloturer, setCourriers]);

// 2. Ajouter "async" devant les paramètres de la fonction
// const handleCloturer = useCallback(async (id: number) => {
//     try {
//       // 3. Exécuter la fonction asynchrone
//       const { success, courrier } = await cloturer(id);
  
//       // 4. (Optionnel mais recommandé) Vérifier le succès avant de mettre à jour l'état
//       if (success && courrier) {
//         setCourriers(prev => 
//           prev.map(m => m.id === id ? { ...m, cloturePar: courrier.cloturePar } : m)
//         );
//         setStep({ level: 'courriers' });
        
//       }
     
//     } catch (err) {
//       console.error("Erreur lors de la clôture :", err);
//     }
    
//   // 5. Ne pas oublier d'ajouter 'cloturer' dans le tableau des dépendances
// }, [cloturer, setCourriers]);


  useMercureSubscription<MessageCourrier>('message', handleTransfert);
  useMercureSubscription<{ id: number; courrier:Courrier;isReadAt: string | null }>('lectureMessage', handleLecture);
  useMercureSubscription<{ id: number; cloturePar: User | null }>('clotureCourrier', handleCloturer);

  // --- RENDU ---

  if (step.level === 'courriers') {
    return (
      <div className="flex flex-col gap-4">
        <CourrierListView 
          courriers={courriers} 
          loading={loading && courriers.length === 0} 
          error={error} 
          onSelect={(c) => setStep({ level: 'messages', courrier: c })} 
          setIsTraiterAt={setIsTraiterAt}
          isTraiterAt={isTraiterAt}
          setHasMoreCourriers={setHasMoreCourriers}
          nbNonTraite={nbNonTraiteState}
        />
        {hasMoreCourriers && courriers.length > 0 && (
          <div className="flex justify-center px-4 pb-4 pt-2">
            <button
              onClick={loadMoreCourriers}
              disabled={loading}
              className={[
                'group relative w-full sm:w-auto px-5 py-2.5 sm:py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 border',
                loading
                  ? 'bg-muted text-muted-foreground border-border cursor-not-allowed'
                  : 'bg-card text-primary border-primary/30 hover:border-primary hover:bg-primary/5 hover:shadow-sm active:scale-95'
              ].join(' ')}
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4 text-muted-foreground" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-primary/50 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              )}
              <span>{loading ? 'Chargement...' : 'Afficher plus de courriers'}</span>
            </button>
          </div>
        )}
      </div>
    )
  }

  if (step.level === 'messages') {
    return (
      <div className="flex flex-col gap-4">
        <MessageListView
          courrier={step.courrier}
          messages={messages}
          loading={loading && messages.length === 0}
          error={error}
          currentUserId={String(currentUserId)}
          onSelect={(m) => setStep({ level: 'detail', courrier: step.courrier, message: m })}
          onBack={() => setStep({ level: 'courriers' })}
          isRecherche={isRecherche}
          updateHistorique={updateHistorique}
        />
        {hasMoreMessages && messages.length > 0 && (
            <div className="flex justify-center px-4 pb-4 pt-2">
              <button
                onClick={loadMoreMessages}
                disabled={loading}
                className={[
                  'group relative w-full sm:w-auto px-5 py-2.5 sm:py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 border',
                  loading
                    ? 'bg-muted text-muted-foreground border-border cursor-not-allowed'
                    : 'bg-card text-primary border-primary/30 hover:border-primary hover:bg-primary/5 hover:shadow-sm active:scale-95'
                ].join(' ')}
              >
                {loading ? (
                  <svg className="animate-spin h-4 w-4 text-muted-foreground" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 text-primary/50 group-hover:text-primary transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                  </svg>
                )}
                <span>{loading ? 'Récupération...' : 'Charger les messages précédents'}</span>
              </button>
            </div>
          )}
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 flex justify-center">
      <div className="w-full max-w-3xl">
        <MessageDetailView
          courrier={step.courrier}
          message={step.message}
          messages={messages}
          currentUserId={String(currentUserId)}
          onBack={() => setStep({ level: 'messages', courrier: step.courrier })}
          onMessageRead={handleMessageRead}
          onCloture={handleLocalCloturation}
        />
      </div>
    </div>
  )
}