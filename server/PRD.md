## Product Requirement Document (PRD) – Collectam Platform

### 1. Contexte et objectif
Collectam facilite la gestion des déchets pour ménages, entreprises, collecteurs et administrateurs. La plateforme permet de programmer, suivre et optimiser les collectes, d’assurer la traçabilité et d’orchestrer les opérations via des dashboards adaptés à chaque rôle.

### 2. Périmètre (Scope)
- Inclus: inscription/connexion, invitations affiliées, OTP, gestion des organisations (Collectam Business), missions de collecte, suivi en temps réel, gestion des collecteurs/véhicules, signalements, médias, notifications, dashboards, audit.
- Exclus (Phase ultérieure): optimisation de tournées avancée, monétisation/facturation, SSO entreprises, analytics prédictifs.

### 3. Rôles et RBAC
- super-admin: accès global à toutes les organisations et modules.
- org_admin: accès complet limité à son `organizationId` (collecteurs, véhicules, missions, signalements, médias).
- collector: accès aux missions assignées, signalements, véhicule(s) affilié(s).
- user (ménage/entreprise): planification, suivi, historique, preuves de collecte.

Règles:
- Scoping automatique par `organizationId` côté API (row-level filtering) pour org_admin/collector.
- Un Business ne voit pas les points non reliés à ses missions.

### 4. Parcours clés
4.1 Inscription et affiliation
- Lien d’invitation signé (JWT) 
  - payload: { role, organizationId?, invitedBy, jti }, TTL (ex. 72h), usage unique, révocable.
  - redirige vers une page dédiée (admin / business / collector / user) avec pré-remplissage.
- Vérification de compte via OTP (SMS/email): 6 chiffres, TTL 5 min, 5 essais max, verrouillage 15 min.
- Réémission d’invitation/OTP, pages d’erreur (expired/invalidated).

4.2 Création/gestion de missions
- User planifie une collecte (date, type de déchet, adresse, médias facultatifs).
- Org_admin assigne une mission à un collector/vehicule (ou attribution auto).
- Collector exécute et clôture avec preuves (photo, QR/NFC), géofencing (±50m), horodatage signé.

4.3 Suivi en temps réel
- Positions collecteurs/véhicules publiées en WebSocket (fréquence adaptative), vues cartes/dashboards.
- États de mission mis à jour en temps réel.

4.4 Signalements
- User/collector créent des signalements (catégorie, priorité, description, médias, géoloc); SLA de traitement.

### 5. Cycle de vie des missions
États: `planned → assigned → in_progress → blocked → completed → cancelled`
- Transition rules:
  - planned→assigned: affectation collector+vehicule requise
  - assigned→in_progress: check-in géo à proximité du point ou scan QR
  - in_progress→blocked: motifs codifiés (panne, accès impossible, indispo), pièces jointes
  - in_progress→completed: photo « après » requise, scan QR/NFC, geofence ±50m, timestamp serveur
  - Any→cancelled: motif obligatoire, règles qui interdisent la suppression de preuves

Preuves:
- Médias (avant/après), signature serveur (hash + timestamp), géohash du point de collecte.

### 6. Données (aperçu du modèle)
- Organization: nom, paramètres, quotas, webhooks, préférences.
- User: identité, rôle, `organizationId?`, préférences notification, sessions/refresh tokens.
- Invitation: jti, rôle, organizationId?, TTL, status (active/revoked/used), audit.
- Vehicle: registration, capacity, organizationId, état, gpsData(lastUpdated, lat/lon).
- Mission: userId, organizationId, collectorId, vehicleId, status, location(Point), fenêtre horaire, preuves, timeline.
- CollectionReport: userId, location, wasteType, médias, statut.
- IssueReport: auteur, type, criticité, état, pièces jointes, SLA dates.
- Media: url, type, taille, owner/resource refs, horodatage, hash.
- AuditLog: who, what, when, where (ip), before/after diffs (si pertinent).

Contraintes:
- Index géospatiaux sur `location`.
- Index composites par `organizationId` + status/date.

### 7. Sécurité et conformité
- OTP: TTL 5 min, 5 essais, verrouillage 15 min, ratelimiting par IP/device.
- Invitations: JWT signé, usage unique (stockage jti), révocable, TTL, scope strict (rôle, org).
- Auth: rotation clés JWT, refresh tokens persistés et révocables, liste des sessions.
- Autorisations: RBAC strict + scoping `organizationId`.
- Vie privée: consentement géoloc, rétention médias (ex. 180 jours), purge, droit d’oubli.
- Journalisation/Audit: actions sensibles (création admin, assignation mission, changement état).

### 8. Temps réel et mobile terrain
- WebSocket pour positions et états; fallback polling long si nécessaire.
- Mode hors‑ligne collecteur: queue locale d’événements (missions, signaux, médias), sync avec résolution de conflits.
- UX sécurité conduite: grandes cibles, feedback haptique/vocal, dark mode.

### 9. Dashboards
- Admin global: santé système (jobs, files), heatmaps dépôts, anomalies, audit, quotas.
- Business (org_admin): productivité collecteurs, utilisation flotte, taux d’achèvement, exports CSV, filtres.
- Collector: liste missions (aujourd’hui/prochaines), navigation, checklists, signalements.
- User: planification simple, suivi en temps réel, historique, replanification, preuves de collecte.

### 10. Notifications
- Multicanal: push, SMS, email. Préférences par rôle.
- Templates transactionnels: mission assignée, collector en approche, clôture, échec/contretemps.
- Stratégie de retry/backoff, idempotence (dedupe keys), traçabilité.

### 11. Règles métier avancées
- Attribution automatique par zone, charge, distance, fenêtre horaire, capacité véhicule.
- Restrictions de visibilité: Business ne voit que ses ressources et missions.
- Pénalités/no‑show, re‑tentatives, escalade admin pour blocages répétés.

### 12. Non-fonctionnel (NFR)
- Performance/Scalabilité: Redis cache/sessions, files de jobs (Bull), base Mongo avec index.
- Résilience: retries, circuit breakers, idempotency keys pour endpoints critiques.
- Observabilité: logs structurés, métriques (Prometheus), traces (OpenTelemetry), alerting.
- API: versionnement, pagination/filtrage/sort standardisés; webhooks (mission créée/assignée/complétée).
- Accessibilité (WCAG AA), i18n, PWA/mobile-first.

### 13. KPIs
- Opérations: délai assignation, délai collecte, taux missions à l’heure, taux completed, replanifications.
- Identité: taux réussite OTP, invalidation invitations, conversions invitation→inscription.
- Utilisation: MAU/DAU par rôle, productivité collecteur, utilisation flotte, temps moyen mission.
- Qualité: taux photos valides, taux signalements résolus dans SLA, score de confiance.

### 14. Critères d’acceptation (exemples)
- OTP: codes 6 chiffres, TTL 5 min, max 5 essais, verrouillage 15 min; logs d’audit.
- Lien d’invitation admin: usage unique, TTL 72h, révocable, invalide après création compte.
- Mission « completed »: photo « après » requise, geofence ±50m, scan QR/NFC < 2 min, timestamp serveur.
- WebSocket: mise à jour état mission < 2 s de latence perçue; fallback OK.

### 15. Phasage
- Phase 1 (MVP): Auth + OTP, invitations affiliées, création/assignation/suivi mission, app collecteur de base, dashboard Business minimal, notifications transactionnelles, audit, pagination.
- Phase 2: optimisation routage, mode hors‑ligne collector, modération médias, métriques/KPIs, webhooks, exports.
- Phase 3: plans payants Business, SSO entreprises, SLA avancés, analytics prédictifs.

### 16. Risques et mitigations
- Connectivité terrain faible: mode offline + sync, reprise sur incident.
- Données sensibles (géoloc, médias): chiffrement en transit, politiques de rétention, contrôle d’accès strict.
- Charge temps réel: backpressure WS, échantillonnage positions, agrégation serveur.

### 17. Questions ouvertes
- Politique de rétention exacte des médias et des audit logs (90/180/365 jours?).
- Seuils de géofencing et tolérances selon zones denses vs rurales.
- Modèle de tarification et limites par plan Business (collecteurs, missions/jour, stockage).

### 18. Plan d'action (phases, jalons, responsables)

Phase 0 – Préparation (Semaine 0)
- Gouvernance: définir rôles internes (PO, Tech Lead, Sécurité, SRE, Data), rituel weekly.
- Environnements: dev/stage/prod, CI/CD minimal, conventions API, style code, PR policy.
- Backlog: découpage des user stories prioritaires (MVP), critères d’acceptation, DoD.

Phase 1 – MVP Fonctionnel (Semaines 1–4)
- Auth & Sécurité (Owner: Tech Lead Sécurité)
  - OTP robuste (TTL, essais, verrouillage), ratelimiting, audit.
  - Invitations JWT (scope, TTL, usage unique, révocation) + pages d’acceptation.
- RBAC & Multi-tenant (Owner: Backend)
  - Rôles (super-admin, org_admin, collector, user) + scoping `organizationId`.
  - Seeds: 1 org de test, 1 admin global, 1 org_admin, 2 collectors, 1 user.
- Missions de base (Owner: Backend + Mobile/Front Collecteur)
  - CRUD mission: planned→assigned→in_progress→completed/cancelled.
  - Preuves: upload photo, scan QR, geofence ±50m (contrôle serveur).
- Dashboards minimaux (Owner: Front Backoffice)
  - Business: liste missions, assignation, filtres (status/date/collector).
  - User: planification simple + suivi en temps réel basique.
- Temps réel (Owner: Backend Realtime)
  - WebSocket pour états de mission; fallback polling.
- Observabilité (Owner: SRE)
  - Logs structurés, métriques essentielles (latence, erreurs, WS connexions).

Jalons Phase 1
- Fin S2: Auth/OTP/Invitations en place + RBAC.
- Fin S3: Missions avec preuves + WS basique.
- Fin S4: Dashboards minimaux + tests E2E happy path.

Phase 2 – Robustesse et Opérations (Semaines 5–8)
- Mode hors‑ligne collecteur (Owner: Mobile/Front Collecteur)
  - Queue locale, sync, résolution de conflits.
- Règles métier + attribution (Owner: Backend)
  - Attribution auto (zone/distance/capacité/fenêtre horaire), motifs d’annulation.
- Modération & qualité (Owner: Backend + Sécurité)
  - Validation médias, limites taille/format, déduplication signalements.
- Notifications (Owner: Backend Intégrations)
  - Templates transactionnels, retries/backoff, idempotence.
- Observabilité avancée (Owner: SRE)
  - Dashboards, alerting, traces distribuées; tests de charge.

Jalons Phase 2
- Fin S6: Offline prêt + attribution auto v1.
- Fin S8: Notifications, modération, observabilité avancée.

Phase 3 – Valeur Business & Scalabilité (Semaines 9–12)
- Webhooks & intégrations (Owner: Backend Intégrations)
  - Événements clés (mission créée/assignée/complétée), replays, signatures.
- Plans Business (Owner: Produit + Backend)
  - Limites (collecteurs/véhicules/missions), métriques d’usage; préparation facturation.
- Optimisation (Owner: Data/Algo)
  - Routage initial (heuristique), KPIs productivité, heatmaps.

Jalons Phase 3
- Fin S10: Webhooks stables + plans limites.
- Fin S12: Routage v1 + KPIs/rapports Business.

Transversal – Qualité & Sécurité (continu)
- Tests: unitaires, intégration, E2E, contrats API; gates CI obligatoires.
- Sécurité: pentest léger, SAST/DAST, rotation clés JWT, politiques de rétention.
- Documentation: API versionnée, runbooks SRE, playbooks incident.

Risques & Mitigation
- Connectivité terrain: offline + retries; monitoring des échecs de sync.
- Charge WS: échantillonnage, agrégation, backpressure; scale horizontale + Redis.
- Données sensibles: chiffrement en transit, contrôle d’accès strict, purge planifiée.


