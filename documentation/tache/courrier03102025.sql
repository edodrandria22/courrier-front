--
-- PostgreSQL database dump
--

\restrict TmZmqAzgaV24fqY3rl1qKDEHeijFDOq4UT9CISS3LNuaAXexFX52YZwFcjkOX7q

-- Dumped from database version 16.15 (Ubuntu 16.15-1.pgdg24.04+2)
-- Dumped by pg_dump version 16.15 (Ubuntu 16.15-1.pgdg24.04+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: courrier_validations; Type: TABLE; Schema: public; Owner: mesupres
--

CREATE TABLE public.courrier_validations (
    id integer NOT NULL,
    createur_id integer,
    created_at timestamp(0) without time zone NOT NULL,
    deleted_at timestamp(0) without time zone DEFAULT NULL::timestamp without time zone,
    object text NOT NULL,
    ville text,
    date_debut timestamp(0) without time zone NOT NULL,
    date_fin timestamp(0) without time zone NOT NULL,
    date_validation timestamp(0) without time zone DEFAULT NULL::timestamp without time zone,
    observation text,
    observation_superviseur text
);


ALTER TABLE public.courrier_validations OWNER TO mesupres;

--
-- Name: COLUMN courrier_validations.created_at; Type: COMMENT; Schema: public; Owner: mesupres
--

COMMENT ON COLUMN public.courrier_validations.created_at IS '(DC2Type:datetime_immutable)';


--
-- Name: COLUMN courrier_validations.deleted_at; Type: COMMENT; Schema: public; Owner: mesupres
--

COMMENT ON COLUMN public.courrier_validations.deleted_at IS '(DC2Type:datetime_immutable)';


--
-- Name: COLUMN courrier_validations.date_debut; Type: COMMENT; Schema: public; Owner: mesupres
--

COMMENT ON COLUMN public.courrier_validations.date_debut IS '(DC2Type:datetime_immutable)';


--
-- Name: COLUMN courrier_validations.date_fin; Type: COMMENT; Schema: public; Owner: mesupres
--

COMMENT ON COLUMN public.courrier_validations.date_fin IS '(DC2Type:datetime_immutable)';


--
-- Name: COLUMN courrier_validations.date_validation; Type: COMMENT; Schema: public; Owner: mesupres
--

COMMENT ON COLUMN public.courrier_validations.date_validation IS '(DC2Type:datetime_immutable)';


--
-- Name: courrier_validations_id_seq; Type: SEQUENCE; Schema: public; Owner: mesupres
--

CREATE SEQUENCE public.courrier_validations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.courrier_validations_id_seq OWNER TO mesupres;

--
-- Name: courrier_validations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mesupres
--

ALTER SEQUENCE public.courrier_validations_id_seq OWNED BY public.courrier_validations.id;


--
-- Name: courriers; Type: TABLE; Schema: public; Owner: mesupres
--

CREATE TABLE public.courriers (
    id integer NOT NULL,
    createur_id integer,
    cloture_par_id integer,
    created_at timestamp(0) without time zone NOT NULL,
    deleted_at timestamp(0) without time zone DEFAULT NULL::timestamp without time zone,
    reference character varying(100) NOT NULL,
    object text NOT NULL,
    description text,
    date_message timestamp(0) without time zone DEFAULT NULL::timestamp without time zone,
    is_confidentiel boolean,
    date_validation timestamp(0) without time zone DEFAULT NULL::timestamp without time zone
);


ALTER TABLE public.courriers OWNER TO mesupres;

--
-- Name: COLUMN courriers.created_at; Type: COMMENT; Schema: public; Owner: mesupres
--

COMMENT ON COLUMN public.courriers.created_at IS '(DC2Type:datetime_immutable)';


--
-- Name: COLUMN courriers.deleted_at; Type: COMMENT; Schema: public; Owner: mesupres
--

COMMENT ON COLUMN public.courriers.deleted_at IS '(DC2Type:datetime_immutable)';


--
-- Name: COLUMN courriers.date_message; Type: COMMENT; Schema: public; Owner: mesupres
--

COMMENT ON COLUMN public.courriers.date_message IS '(DC2Type:datetime_immutable)';


--
-- Name: COLUMN courriers.date_validation; Type: COMMENT; Schema: public; Owner: mesupres
--

COMMENT ON COLUMN public.courriers.date_validation IS '(DC2Type:datetime_immutable)';


--
-- Name: courriers_id_seq; Type: SEQUENCE; Schema: public; Owner: mesupres
--

CREATE SEQUENCE public.courriers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.courriers_id_seq OWNER TO mesupres;

--
-- Name: courriers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mesupres
--

ALTER SEQUENCE public.courriers_id_seq OWNED BY public.courriers.id;


--
-- Name: detail_personnes; Type: TABLE; Schema: public; Owner: mesupres
--

CREATE TABLE public.detail_personnes (
    id integer NOT NULL,
    courrier_id integer,
    created_at timestamp(0) without time zone NOT NULL,
    deleted_at timestamp(0) without time zone DEFAULT NULL::timestamp without time zone,
    name character varying(255) DEFAULT NULL::character varying,
    email character varying(255),
    prenom character varying(255) DEFAULT NULL::character varying,
    telephone character varying(255) DEFAULT NULL::character varying,
    matricule integer,
    entite_id integer,
    employeur_id integer
);


ALTER TABLE public.detail_personnes OWNER TO mesupres;

--
-- Name: COLUMN detail_personnes.created_at; Type: COMMENT; Schema: public; Owner: mesupres
--

COMMENT ON COLUMN public.detail_personnes.created_at IS '(DC2Type:datetime_immutable)';


--
-- Name: COLUMN detail_personnes.deleted_at; Type: COMMENT; Schema: public; Owner: mesupres
--

COMMENT ON COLUMN public.detail_personnes.deleted_at IS '(DC2Type:datetime_immutable)';


--
-- Name: detail_personnes_id_seq; Type: SEQUENCE; Schema: public; Owner: mesupres
--

CREATE SEQUENCE public.detail_personnes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.detail_personnes_id_seq OWNER TO mesupres;

--
-- Name: detail_personnes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mesupres
--

ALTER SEQUENCE public.detail_personnes_id_seq OWNED BY public.detail_personnes.id;


--
-- Name: doctrine_migration_versions; Type: TABLE; Schema: public; Owner: mesupres
--

CREATE TABLE public.doctrine_migration_versions (
    version character varying(191) NOT NULL,
    executed_at timestamp(0) without time zone DEFAULT NULL::timestamp without time zone,
    execution_time integer
);


ALTER TABLE public.doctrine_migration_versions OWNER TO mesupres;

--
-- Name: employeurs; Type: TABLE; Schema: public; Owner: mesupres
--

CREATE TABLE public.employeurs (
    id integer NOT NULL,
    created_at timestamp(0) without time zone NOT NULL,
    deleted_at timestamp(0) without time zone DEFAULT NULL::timestamp without time zone,
    name character varying(255) NOT NULL
);


ALTER TABLE public.employeurs OWNER TO mesupres;

--
-- Name: COLUMN employeurs.created_at; Type: COMMENT; Schema: public; Owner: mesupres
--

COMMENT ON COLUMN public.employeurs.created_at IS '(DC2Type:datetime_immutable)';


--
-- Name: COLUMN employeurs.deleted_at; Type: COMMENT; Schema: public; Owner: mesupres
--

COMMENT ON COLUMN public.employeurs.deleted_at IS '(DC2Type:datetime_immutable)';


--
-- Name: employeurs_id_seq; Type: SEQUENCE; Schema: public; Owner: mesupres
--

CREATE SEQUENCE public.employeurs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employeurs_id_seq OWNER TO mesupres;

--
-- Name: employeurs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mesupres
--

ALTER SEQUENCE public.employeurs_id_seq OWNED BY public.employeurs.id;


--
-- Name: entites; Type: TABLE; Schema: public; Owner: mesupres
--

CREATE TABLE public.entites (
    id integer NOT NULL,
    created_at timestamp(0) without time zone NOT NULL,
    deleted_at timestamp(0) without time zone DEFAULT NULL::timestamp without time zone,
    name character varying(255) NOT NULL
);


ALTER TABLE public.entites OWNER TO mesupres;

--
-- Name: COLUMN entites.created_at; Type: COMMENT; Schema: public; Owner: mesupres
--

COMMENT ON COLUMN public.entites.created_at IS '(DC2Type:datetime_immutable)';


--
-- Name: COLUMN entites.deleted_at; Type: COMMENT; Schema: public; Owner: mesupres
--

COMMENT ON COLUMN public.entites.deleted_at IS '(DC2Type:datetime_immutable)';


--
-- Name: entites_id_seq; Type: SEQUENCE; Schema: public; Owner: mesupres
--

CREATE SEQUENCE public.entites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.entites_id_seq OWNER TO mesupres;

--
-- Name: entites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mesupres
--

ALTER SEQUENCE public.entites_id_seq OWNED BY public.entites.id;


--
-- Name: fichiers; Type: TABLE; Schema: public; Owner: mesupres
--

CREATE TABLE public.fichiers (
    id integer NOT NULL,
    message_id integer,
    created_at timestamp(0) without time zone NOT NULL,
    deleted_at timestamp(0) without time zone DEFAULT NULL::timestamp without time zone,
    nom character varying(255) NOT NULL,
    type character varying(255) NOT NULL,
    binaire bytea,
    date_fin timestamp(0) without time zone DEFAULT NULL::timestamp without time zone
);


ALTER TABLE public.fichiers OWNER TO mesupres;

--
-- Name: COLUMN fichiers.created_at; Type: COMMENT; Schema: public; Owner: mesupres
--

COMMENT ON COLUMN public.fichiers.created_at IS '(DC2Type:datetime_immutable)';


--
-- Name: COLUMN fichiers.deleted_at; Type: COMMENT; Schema: public; Owner: mesupres
--

COMMENT ON COLUMN public.fichiers.deleted_at IS '(DC2Type:datetime_immutable)';


--
-- Name: fichiers_id_seq; Type: SEQUENCE; Schema: public; Owner: mesupres
--

CREATE SEQUENCE public.fichiers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fichiers_id_seq OWNER TO mesupres;

--
-- Name: fichiers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mesupres
--

ALTER SEQUENCE public.fichiers_id_seq OWNED BY public.fichiers.id;


--
-- Name: historiques; Type: TABLE; Schema: public; Owner: mesupres
--

CREATE TABLE public.historiques (
    id integer NOT NULL,
    utilisateur_id integer NOT NULL,
    courrier_id integer NOT NULL,
    message_id integer,
    created_at timestamp(0) without time zone NOT NULL,
    deleted_at timestamp(0) without time zone DEFAULT NULL::timestamp without time zone,
    is_send boolean NOT NULL,
    numero integer,
    num_ref integer,
    observation text,
    date_reception timestamp(0) without time zone DEFAULT NULL::timestamp without time zone
);


ALTER TABLE public.historiques OWNER TO mesupres;

--
-- Name: COLUMN historiques.created_at; Type: COMMENT; Schema: public; Owner: mesupres
--

COMMENT ON COLUMN public.historiques.created_at IS '(DC2Type:datetime_immutable)';


--
-- Name: COLUMN historiques.deleted_at; Type: COMMENT; Schema: public; Owner: mesupres
--

COMMENT ON COLUMN public.historiques.deleted_at IS '(DC2Type:datetime_immutable)';


--
-- Name: COLUMN historiques.date_reception; Type: COMMENT; Schema: public; Owner: mesupres
--

COMMENT ON COLUMN public.historiques.date_reception IS '(DC2Type:datetime_immutable)';


--
-- Name: historiques_id_seq; Type: SEQUENCE; Schema: public; Owner: mesupres
--

CREATE SEQUENCE public.historiques_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historiques_id_seq OWNER TO mesupres;

--
-- Name: historiques_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mesupres
--

ALTER SEQUENCE public.historiques_id_seq OWNED BY public.historiques.id;


--
-- Name: messages; Type: TABLE; Schema: public; Owner: mesupres
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    courrier_id integer NOT NULL,
    expediteur_id integer,
    destinataire_id integer NOT NULL,
    created_at timestamp(0) without time zone NOT NULL,
    deleted_at timestamp(0) without time zone DEFAULT NULL::timestamp without time zone,
    date_validation timestamp(0) without time zone DEFAULT NULL::timestamp without time zone,
    is_read_at timestamp(0) without time zone DEFAULT NULL::timestamp without time zone,
    observation text,
    numero_expediteur integer,
    numero_destinataire integer,
    is_traiter_at timestamp(0) without time zone DEFAULT NULL::timestamp without time zone,
    bordureau text
);


ALTER TABLE public.messages OWNER TO mesupres;

--
-- Name: COLUMN messages.created_at; Type: COMMENT; Schema: public; Owner: mesupres
--

COMMENT ON COLUMN public.messages.created_at IS '(DC2Type:datetime_immutable)';


--
-- Name: COLUMN messages.deleted_at; Type: COMMENT; Schema: public; Owner: mesupres
--

COMMENT ON COLUMN public.messages.deleted_at IS '(DC2Type:datetime_immutable)';


--
-- Name: COLUMN messages.date_validation; Type: COMMENT; Schema: public; Owner: mesupres
--

COMMENT ON COLUMN public.messages.date_validation IS '(DC2Type:datetime_immutable)';


--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: mesupres
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.messages_id_seq OWNER TO mesupres;

--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mesupres
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- Name: numero_courriers; Type: TABLE; Schema: public; Owner: mesupres
--

CREATE TABLE public.numero_courriers (
    id integer NOT NULL,
    utilisateur_id integer,
    created_at timestamp(0) without time zone NOT NULL,
    deleted_at timestamp(0) without time zone DEFAULT NULL::timestamp without time zone,
    numero integer,
    is_send boolean NOT NULL
);


ALTER TABLE public.numero_courriers OWNER TO mesupres;

--
-- Name: COLUMN numero_courriers.created_at; Type: COMMENT; Schema: public; Owner: mesupres
--

COMMENT ON COLUMN public.numero_courriers.created_at IS '(DC2Type:datetime_immutable)';


--
-- Name: COLUMN numero_courriers.deleted_at; Type: COMMENT; Schema: public; Owner: mesupres
--

COMMENT ON COLUMN public.numero_courriers.deleted_at IS '(DC2Type:datetime_immutable)';


--
-- Name: numero_courriers_id_seq; Type: SEQUENCE; Schema: public; Owner: mesupres
--

CREATE SEQUENCE public.numero_courriers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.numero_courriers_id_seq OWNER TO mesupres;

--
-- Name: numero_courriers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mesupres
--

ALTER SEQUENCE public.numero_courriers_id_seq OWNED BY public.numero_courriers.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: mesupres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    created_at timestamp(0) without time zone NOT NULL,
    deleted_at timestamp(0) without time zone DEFAULT NULL::timestamp without time zone,
    name character varying(255) NOT NULL
);


ALTER TABLE public.roles OWNER TO mesupres;

--
-- Name: COLUMN roles.created_at; Type: COMMENT; Schema: public; Owner: mesupres
--

COMMENT ON COLUMN public.roles.created_at IS '(DC2Type:datetime_immutable)';


--
-- Name: COLUMN roles.deleted_at; Type: COMMENT; Schema: public; Owner: mesupres
--

COMMENT ON COLUMN public.roles.deleted_at IS '(DC2Type:datetime_immutable)';


--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: mesupres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO mesupres;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mesupres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: utilisateurs; Type: TABLE; Schema: public; Owner: mesupres
--

CREATE TABLE public.utilisateurs (
    id integer NOT NULL,
    role_id integer NOT NULL,
    created_at timestamp(0) without time zone NOT NULL,
    deleted_at timestamp(0) without time zone DEFAULT NULL::timestamp without time zone,
    email character varying(255) NOT NULL,
    mdp character varying(255) NOT NULL,
    nom character varying(255) NOT NULL,
    prenom character varying(255) DEFAULT NULL::character varying,
    adresse character varying(255) DEFAULT NULL::character varying,
    sigle character varying(255) DEFAULT NULL::character varying,
    date_inactif timestamp(0) without time zone DEFAULT NULL::timestamp without time zone
);


ALTER TABLE public.utilisateurs OWNER TO mesupres;

--
-- Name: COLUMN utilisateurs.created_at; Type: COMMENT; Schema: public; Owner: mesupres
--

COMMENT ON COLUMN public.utilisateurs.created_at IS '(DC2Type:datetime_immutable)';


--
-- Name: COLUMN utilisateurs.deleted_at; Type: COMMENT; Schema: public; Owner: mesupres
--

COMMENT ON COLUMN public.utilisateurs.deleted_at IS '(DC2Type:datetime_immutable)';


--
-- Name: COLUMN utilisateurs.date_inactif; Type: COMMENT; Schema: public; Owner: mesupres
--

COMMENT ON COLUMN public.utilisateurs.date_inactif IS '(DC2Type:datetime_immutable)';


--
-- Name: utilisateurs_id_seq; Type: SEQUENCE; Schema: public; Owner: mesupres
--

CREATE SEQUENCE public.utilisateurs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.utilisateurs_id_seq OWNER TO mesupres;

--
-- Name: utilisateurs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mesupres
--

ALTER SEQUENCE public.utilisateurs_id_seq OWNED BY public.utilisateurs.id;


--
-- Name: vue_historique_details; Type: VIEW; Schema: public; Owner: mesupres
--

CREATE VIEW public.vue_historique_details AS
 SELECT c.id,
    c.createur_id,
    c.cloture_par_id,
    c.created_at,
    c.deleted_at,
    c.date_validation,
    c.reference,
    c.object,
    c.description,
    c.is_confidentiel,
    h.id AS historique_id,
    h.utilisateur_id,
    h.is_send,
    h.numero,
    h.num_ref,
    h.created_at AS date_message,
    m.destinataire_id,
    m.expediteur_id,
    h.message_id,
    h.observation,
    m.is_read_at,
    h.date_reception,
    m.is_traiter_at,
    m.numero_expediteur,
    m.numero_destinataire,
    m.bordureau
   FROM ((public.historiques h
     JOIN public.courriers c ON ((h.courrier_id = c.id)))
     LEFT JOIN public.messages m ON ((h.message_id = m.id)))
  WHERE (h.deleted_at IS NULL);


ALTER VIEW public.vue_historique_details OWNER TO mesupres;

--
-- Name: vue_historique_detail_personnes; Type: VIEW; Schema: public; Owner: mesupres
--

CREATE VIEW public.vue_historique_detail_personnes AS
 SELECT v.id,
    v.createur_id,
    v.cloture_par_id,
    v.created_at,
    v.deleted_at,
    v.date_validation,
    v.reference,
    v.object,
    v.description,
    v.is_confidentiel,
    v.historique_id,
    v.utilisateur_id,
    v.is_send,
    v.numero,
    v.num_ref,
    v.date_message,
    v.destinataire_id,
    v.expediteur_id,
    v.message_id,
    v.observation,
    v.is_read_at,
    v.date_reception,
    v.is_traiter_at,
    v.numero_expediteur,
    v.numero_destinataire,
    v.bordureau,
    dp.name,
    dp.prenom,
    dp.email,
    dp.telephone,
    dp.matricule,
    dp.employeur_id,
    dp.entite_id,
    lower((((COALESCE(dp.name, ''::character varying))::text || ' '::text) || (COALESCE(dp.prenom, ''::character varying))::text)) AS nom_complet
   FROM (public.vue_historique_details v
     LEFT JOIN public.detail_personnes dp ON (((dp.courrier_id = v.id) AND (dp.deleted_at IS NULL))));


ALTER VIEW public.vue_historique_detail_personnes OWNER TO mesupres;

--
-- Name: vue_utilisateurs; Type: VIEW; Schema: public; Owner: mesupres
--

CREATE VIEW public.vue_utilisateurs AS
 SELECT id,
    role_id,
    created_at,
    deleted_at,
    email,
    mdp,
    nom,
    prenom,
    adresse,
    sigle,
    date_inactif,
    lower((((COALESCE(nom, ''::character varying))::text || ' '::text) || (COALESCE(prenom, ''::character varying))::text)) AS nom_complet
   FROM public.utilisateurs;


ALTER VIEW public.vue_utilisateurs OWNER TO mesupres;

--
-- Name: courrier_validations id; Type: DEFAULT; Schema: public; Owner: mesupres
--

ALTER TABLE ONLY public.courrier_validations ALTER COLUMN id SET DEFAULT nextval('public.courrier_validations_id_seq'::regclass);


--
-- Name: courriers id; Type: DEFAULT; Schema: public; Owner: mesupres
--

ALTER TABLE ONLY public.courriers ALTER COLUMN id SET DEFAULT nextval('public.courriers_id_seq'::regclass);


--
-- Name: detail_personnes id; Type: DEFAULT; Schema: public; Owner: mesupres
--

ALTER TABLE ONLY public.detail_personnes ALTER COLUMN id SET DEFAULT nextval('public.detail_personnes_id_seq'::regclass);


--
-- Name: employeurs id; Type: DEFAULT; Schema: public; Owner: mesupres
--

ALTER TABLE ONLY public.employeurs ALTER COLUMN id SET DEFAULT nextval('public.employeurs_id_seq'::regclass);


--
-- Name: entites id; Type: DEFAULT; Schema: public; Owner: mesupres
--

ALTER TABLE ONLY public.entites ALTER COLUMN id SET DEFAULT nextval('public.entites_id_seq'::regclass);


--
-- Name: fichiers id; Type: DEFAULT; Schema: public; Owner: mesupres
--

ALTER TABLE ONLY public.fichiers ALTER COLUMN id SET DEFAULT nextval('public.fichiers_id_seq'::regclass);


--
-- Name: historiques id; Type: DEFAULT; Schema: public; Owner: mesupres
--

ALTER TABLE ONLY public.historiques ALTER COLUMN id SET DEFAULT nextval('public.historiques_id_seq'::regclass);


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: mesupres
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- Name: numero_courriers id; Type: DEFAULT; Schema: public; Owner: mesupres
--

ALTER TABLE ONLY public.numero_courriers ALTER COLUMN id SET DEFAULT nextval('public.numero_courriers_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: mesupres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: utilisateurs id; Type: DEFAULT; Schema: public; Owner: mesupres
--

ALTER TABLE ONLY public.utilisateurs ALTER COLUMN id SET DEFAULT nextval('public.utilisateurs_id_seq'::regclass);


--
-- Data for Name: courrier_validations; Type: TABLE DATA; Schema: public; Owner: mesupres
--

COPY public.courrier_validations (id, createur_id, created_at, deleted_at, object, ville, date_debut, date_fin, date_validation, observation, observation_superviseur) FROM stdin;
\.


--
-- Data for Name: courriers; Type: TABLE DATA; Schema: public; Owner: mesupres
--

COPY public.courriers (id, createur_id, cloture_par_id, created_at, deleted_at, reference, object, description, date_message, is_confidentiel, date_validation) FROM stdin;
1	4	5	2026-09-10 10:49:49	\N	10093033/1	Univ Tana: demande d'autorisation d'absence , de sortie du territoire et de passeport vert	De se rendre en Suisse, Université Savoie Mont Blanc du 04 au 10 Octobre 2026.	2026-09-10 10:49:49	f	2026-09-11 12:09:33
6	4	5	2026-09-14 08:56:26	\N	14093033/2	Demande de sortie du territoire +OM	De se rendre en France à l'Université de Savoie Mont Blanc du 03 au 17 octobre 2026.	2026-09-14 08:56:26	f	2026-09-15 10:24:45
5	4	5	2026-09-14 08:37:56	\N	14093033/1	Demande de sortie du territoire +OM	De se rendre en France , Université Savoie Mont Blanc du 03 au 17 octobre 2026.	2026-09-14 08:37:56	f	2026-09-15 10:25:15
2	4	5	2026-09-11 10:01:52	\N	11093033/1	Demande d'autorisation de sortie+passeport de service	De se rendre à Paris du 30 septembre au 03 octobre 2026	2026-09-11 10:01:52	f	2026-09-15 10:25:46
3	4	5	2026-09-11 10:09:54	\N	11093033/2	Demande d'autorisation de sortie+passeport de service +OM	De se rendre  au Senegal du 17 au 19 septembre 2026 	2026-09-11 10:09:54	f	2026-09-15 10:26:07
4	4	5	2026-09-11 10:22:17	\N	11093033/3	Demande d'autorisation d'absence+OM	De se rendre à Addis Abeba, Ethiopie  du 12 au 16 octobre 2026 	2026-09-11 10:22:17	f	2026-09-15 10:26:37
17	4	4	2026-09-28 12:43:39	\N	30333816/4	Demande de sortie du territoire +OM	De se rendre à Vienne, Autriche le 17 au 26 Octobre 2026	2026-09-28 12:43:39	f	2026-09-30 11:29:38
12	4	5	2026-09-23 11:30:58	\N	30333316/2	Demande de sortie du territoire +OM	De se rendre en France du 09 au 22 novembre 2026	2026-09-23 11:30:58	f	2026-09-28 10:54:07
8	4	5	2026-09-22 15:31:33	\N	30333216/2	Demande de sortie du territoire +OM	De se rendre à Mozambique  du 28 au 30 septembre 2026	2026-09-22 15:31:33	f	2026-09-28 10:58:22
11	4	5	2026-09-23 11:26:07	\N	30333316/1	Demande de sortie du territoire +OM	e se rendre en France du 10 au 26 octbre 2026	2026-09-23 11:26:07	f	2026-09-28 10:58:37
18	4	4	2026-09-28 12:59:12	\N	30333816/5	Demande d'autorisation de sortie+passeport de service +OM	De se rendre à Dakar du 01 au 06 Décembre 2026	2026-09-28 12:59:12	f	2026-09-30 11:29:56
19	4	4	2026-09-28 13:04:09	\N	30333816/6	Demande d'autorisation de sortie+passeport de service +OM	De se rendre à Dakar, Sénégal le 30 Novembre au 08 Décembre 2026	2026-09-28 13:04:09	f	2026-09-30 11:30:15
27	4	\N	2026-10-01 13:18:16	\N	30331117/2	Demande de sortie du territoire +OM	de se rendre à Nairobi Kenya du 5 au 8 octobre 2026	2026-10-01 13:18:16	f	\N
28	4	\N	2026-10-02 12:05:46	\N	30331217/1	Demande de sortie du territoire +OM	De se rendre à Addis Abeba du 26 au 31 octobre 2006	2026-10-02 12:05:46	f	\N
20	4	\N	2026-09-29 12:09:34	\N	30333916/1	Demande d'autorisation de sortie+passeport de service +OM	De se rendre en Afrique du Sud du 06 et 11 novembre 2026.	2026-09-29 12:09:34	f	\N
7	4	4	2026-09-22 15:27:40	\N	30333216/1	Demande de sortie du territoire +OM	De se rendre en Italie  Université d'Udine du 01 octobre 2026 au 26 mars 2027	2026-09-22 15:27:40	f	2026-09-30 11:27:53
9	4	4	2026-09-22 15:33:41	\N	30333216/3	Demande de sortie du territoire +OM	De se rendre à Tanzanie du 04 au 10 octobre 2026	2026-09-22 15:33:41	f	2026-09-30 11:28:07
10	4	4	2026-09-22 15:36:40	\N	30333216/4	Demande de sortie du territoire +OM	De se rendre au Sénégal du 17 au 19 novembre 2026	2026-09-22 15:36:40	f	2026-09-30 11:28:21
13	4	4	2026-09-24 15:27:32	\N	30333416/1	Demande d'autorisation d'absence+OM	De se rendre en Italie du 19 au29 octobre 2026.	2026-09-24 15:27:32	f	2026-09-30 11:28:44
14	4	4	2026-09-28 12:07:57	\N	30333816/1	Demande d'autorisation de sortie+passeport de service +OM	De se rendre à Bruxelles le 04 au 18 Novembre 2026.	2026-09-28 12:07:57	f	2026-09-30 11:28:55
15	4	4	2026-09-28 12:26:36	\N	30333816/2	Demande d'autorisation de sortie+passeport de service	De se rendre à Belgique le 04 au 19 Novembre 2026	2026-09-28 12:26:36	f	2026-09-30 11:29:15
16	4	4	2026-09-28 12:36:54	\N	30333816/3	Demande d'autorisation de sortie+passeport de service	De se rendre à Bruxelles  le 04 au 18 Novembre 2026	2026-09-28 12:36:54	f	2026-09-30 11:29:26
23	7	\N	2026-09-30 15:24:31	\N	30334016/3	Demande d'autorisation d'absence et de sortie du territoire	Se rendre à Belgique du 01-22 novembre 2026	2026-09-30 15:24:31	f	\N
24	7	\N	2026-09-30 15:30:01	\N	30334016/4	Demande d'autorisation d'absence et de sortie du territoire	Se rendre en Belgique du 01-22 novembre 2026	2026-09-30 15:30:01	f	\N
25	7	\N	2026-09-30 15:36:50	\N	30334016/5	Demande d'autorisation d'absence et de sortie du territoire	Se rendre en Afrique (Harare) du 12-14 octobre 2026	2026-09-30 15:36:50	f	\N
22	7	7	2026-09-30 11:55:12	\N	30334016/2	Demande d'autorisation d'absence et de sortie de territoire	Se rendre en Belgique du 01-08 novembre 2026	2026-09-30 11:55:12	f	2026-10-01 08:34:04
21	7	7	2026-09-30 11:48:28	\N	30334016/1	Demande d'autorisation d'absence et de sortie de territoire	Se rendre en Belgique du 01-19 novembre 2026	2026-09-30 11:48:28	f	2026-10-01 08:35:43
26	4	\N	2026-10-01 12:10:59	\N	30331117/1	Demande d'autorisation de sortie+passeport de service +OM	De se rendre à Kenya du 12 au 17 octobre 2026	2026-10-01 12:10:59	f	\N
\.


--
-- Data for Name: detail_personnes; Type: TABLE DATA; Schema: public; Owner: mesupres
--

COPY public.detail_personnes (id, courrier_id, created_at, deleted_at, name, email, prenom, telephone, matricule, entite_id, employeur_id) FROM stdin;
1	1	2026-09-10 10:49:49	\N	RASOLOMANANA 	sgsp.mesupres@mesupres.mg	Jean Fanomezantsoa		\N	\N	\N
2	2	2026-09-11 10:01:52	\N	RABIBISOA 	nhcrabibisoa@gmail.com	Nirhy Harinelina Christian	034 89 422 04	\N	\N	\N
3	3	2026-09-11 10:09:54	\N	ELIANAH	tozinye@gmail.com	Toziny Viva	034 46 434 13	\N	\N	\N
4	4	2026-09-11 10:50:11	\N	RAZAFITSALAMA	instn@moov.mg	Falintsoa Fanantenana Asombola		\N	\N	\N
5	5	2026-09-14 08:37:56	2026-09-14 08:39:26	MAHATODY 		Thomas	038 75 444 31	\N	\N	\N
6	5	2026-09-14 08:39:26	\N	MAHATODY 	tsmahatody@gmail.com	Thomas	038 75 444 31	\N	\N	\N
7	6	2026-09-14 08:56:26	\N	RALAIVAO	ralaivao.christian@gmail.com	Jean Christian	034 92 461 90	\N	\N	\N
13	12	2026-09-23 11:30:58	\N	RAZAFIMAHANDRY		Henri Jean Claude		279278	4	\N
8	7	2026-09-22 15:27:40	\N	ANDRANTSITOHAINA		Ravaka Felandranja		481810	1	4
9	8	2026-09-22 15:31:33	\N	RANIVOARIVELO 		Lantoasinoro Nirinarisoa		312427	1	3
10	9	2026-09-22 15:33:41	\N	RANIVOARIVELO		Lantoasinoro Nirinarisoa		312427	1	3
11	10	2026-09-22 15:36:40	\N	ELIANAH	tozinye@gmail.com	Toziny Viva	0344643413	504432	1	3
12	11	2026-09-23 11:26:07	\N	RANDRIAMAROTIA		Haril Franckalaina Willy		288388	4	1
16	15	2026-09-28 12:26:36	\N	RAMIANDRISOA		Njararivelo Louisa 	0342069972	330933	1	1
14	13	2026-09-24 15:27:32	2026-09-28 12:27:24	ANDRIAMANIRAKA	jharilala@gmail.com	Jaona Harilala	0341598017	257256	4	31
17	13	2026-09-28 12:27:24	\N	ANDRIAMANIRAKA	jharilala@gmail.com	Jaona Harilala	0341598017	257256	4	31
18	16	2026-09-28 12:36:54	\N	RATSIMBA	ratsimbavolatiana2@gmail.com	Nivoarisoa Volatiana	0340545658	302383	4	1
19	17	2026-09-28 12:43:39	\N	RABESIRANANA		Naivo	0385846515	302346	4	1
20	18	2026-09-28 12:59:12	\N	RAMANAMPIARIVOLA	rindra_mi@yahoo.fr	Mirindrasoa Bakoly	0349802829	368700	1	1
15	14	2026-09-28 12:07:57	2026-09-28 13:04:51	ANDRIAMIARISETA		Andry Solofo	0345152349	353626	1	1
21	14	2026-09-28 13:04:51	\N	ANDRIAMIARISETA		Andry Solofo	0345152349	353626	1	1
22	20	2026-09-29 12:09:34	\N	RANDRIAMBANONA	zombanona@yahoo.fr	Herizo Andrianantoandro	0346038486	334005	2	21
23	19	2026-09-29 12:30:34	\N	RAKOTONANAHARY	ymamylalao@gmail.com	Mamy Lalao	0340210915	253966	4	1
24	21	2026-09-30 11:48:28	\N	RANDRIANASOLO		Rivoarison		334458	1	1
25	22	2026-09-30 11:55:12	\N	RANDRIAMAROSON		Rivo Mahandrisoa		371079	1	1
26	23	2026-09-30 15:24:31	\N	ANDRIANAHARISON 	fumiko.andria@gmail.com	Fumiko	0327518479	407459	1	1
27	24	2026-09-30 15:30:01	\N	RATSIMBAZAFY		Minoson Laingo Ny Hasina	0345203007	334004	1	1
28	25	2026-09-30 15:36:50	\N	RAZAKASOA RAONINDRIAKA		Soloariseheno		289777	3	\N
29	26	2026-10-01 12:10:59	\N	RAZANAMARO 		Onja Hariveloniaina Morilline		481616	4	26
30	27	2026-10-01 13:18:16	\N	RAKOTOMALALA		Valérie Faliniaina		\N	2	22
31	28	2026-10-02 12:05:46	\N	ANDRIANARANJAKA	fararanontsoa@gmail.com	Voahangy Hanitriniaina Isabelle	0343149745	421992	4	1
\.


--
-- Data for Name: doctrine_migration_versions; Type: TABLE DATA; Schema: public; Owner: mesupres
--

COPY public.doctrine_migration_versions (version, executed_at, execution_time) FROM stdin;
DoctrineMigrations\\Version20260818092905	2026-08-18 09:29:18	48
DoctrineMigrations\\Version20260827131833	2026-08-27 13:23:20	2
DoctrineMigrations\\Version20260831071156	2026-08-31 10:12:04	2
DoctrineMigrations\\Version20260831071528	2026-08-31 10:15:35	1
DoctrineMigrations\\Version20260831071702	2026-08-31 10:17:28	2
DoctrineMigrations\\Version20260911063945	2026-09-11 09:39:52	8
DoctrineMigrations\\Version20260915192605	2026-09-15 22:26:12	4
DoctrineMigrations\\Version20260918073151	2026-09-18 10:32:01	18
DoctrineMigrations\\Version20260926145432	2026-09-26 17:54:38	15
\.


--
-- Data for Name: employeurs; Type: TABLE DATA; Schema: public; Owner: mesupres
--

COPY public.employeurs (id, created_at, deleted_at, name) FROM stdin;
1	2026-09-26 14:58:04	\N	Université d'Antananarivo
2	2026-09-26 14:58:04	\N	Université de Mahajanga
3	2026-09-26 14:58:04	\N	Université de Tuléar
4	2026-09-26 14:58:04	\N	Université de Toamasina
5	2026-09-26 14:58:04	\N	Université de Fianarantsoa
6	2026-09-26 14:58:04	\N	Université d'Antsiranana
7	2026-09-26 14:58:04	\N	Université de l'Itasy
8	2026-09-26 14:58:04	\N	Université de Vakinankaratra
9	2026-09-26 14:58:04	\N	Université d'Analanjorofo
10	2026-09-26 14:58:04	\N	Université de SAVA
11	2026-09-26 14:58:04	\N	Université d'Agnambà
12	2026-09-26 14:58:04	\N	Université d'Alaotra-Mangoro
13	2026-09-26 14:58:04	\N	Université d'Anosy
14	2026-09-26 14:58:04	\N	Université d'Androy
15	2026-09-26 14:58:04	\N	Université d'Androna
16	2026-09-26 14:58:04	\N	Université d'Amoron'i Mania
17	2026-09-26 14:58:04	\N	Université de Menabe
18	2026-09-26 14:58:04	\N	IST d'Antananarivo
19	2026-09-26 14:58:04	\N	IST de Diego
20	2026-09-26 14:58:04	\N	INSTN
21	2026-09-26 14:58:04	\N	CNRE
22	2026-09-26 14:58:04	\N	FOFIFA
23	2026-09-26 14:58:04	\N	CNRO
24	2026-09-26 14:58:04	\N	CNRIT
25	2026-09-26 14:58:04	\N	CNARP
26	2026-09-26 14:58:04	\N	PBZT
27	2026-09-26 14:58:04	\N	IMVAVET
28	2026-09-26 14:58:04	\N	CIDST
29	2026-09-26 14:58:04	\N	CNTEMAD
30	2026-09-26 14:58:04	\N	CNELA
31	2026-09-26 14:58:04	\N	MESUPRES
32	2026-09-26 14:58:04	\N	Autre
\.


--
-- Data for Name: entites; Type: TABLE DATA; Schema: public; Owner: mesupres
--

COPY public.entites (id, created_at, deleted_at, name) FROM stdin;
1	2026-09-18 07:35:59	\N	Enseignant-chercheur
2	2026-09-18 07:35:59	\N	Chercheur-enseignant
3	2026-09-18 07:35:59	\N	PAT
4	2026-09-18 07:35:59	\N	Autre
\.


--
-- Data for Name: fichiers; Type: TABLE DATA; Schema: public; Owner: mesupres
--

COPY public.fichiers (id, message_id, created_at, deleted_at, nom, type, binaire, date_fin) FROM stdin;
\.


--
-- Data for Name: historiques; Type: TABLE DATA; Schema: public; Owner: mesupres
--

COPY public.historiques (id, utilisateur_id, courrier_id, message_id, created_at, deleted_at, is_send, numero, num_ref, observation, date_reception) FROM stdin;
1	4	1	1	2026-09-10 10:49:49	\N	f	943	\N	Maître de Conférence	\N
2	4	1	2	2026-09-10 10:51:28	\N	t	943	\N	\N	\N
3	5	1	2	2026-09-10 10:51:28	\N	f	\N	943	\N	\N
4	4	2	3	2026-09-11 10:01:52	\N	f	945	\N		\N
5	4	2	4	2026-09-11 10:03:35	\N	t	945	\N	\N	\N
6	5	2	4	2026-09-11 10:03:35	\N	f	\N	945	\N	\N
7	4	3	5	2026-09-11 10:09:54	\N	f	946	\N		\N
8	4	4	6	2026-09-11 10:22:17	\N	f	947	\N		\N
9	4	4	7	2026-09-11 11:00:52	\N	t	947	\N	\N	\N
10	5	4	7	2026-09-11 11:00:52	\N	f	\N	947	\N	\N
11	4	3	8	2026-09-11 11:42:37	\N	t	946	\N	\N	\N
12	5	3	8	2026-09-11 11:42:37	\N	f	\N	946	\N	\N
19	4	5	12	2026-09-14 08:37:56	\N	f	948	\N		\N
20	4	6	13	2026-09-14 08:56:26	\N	f	949	\N		\N
21	4	5	14	2026-09-14 09:02:19	\N	t	948	\N	\N	\N
22	5	5	14	2026-09-14 09:02:19	\N	f	\N	948	\N	\N
23	4	6	15	2026-09-14 09:02:46	\N	t	949	\N	\N	\N
24	5	6	15	2026-09-14 09:02:46	\N	f	\N	949	\N	\N
14	4	2	9	2026-09-11 16:42:36	\N	f	945	\N	\N	\N
13	5	2	9	2026-09-11 16:42:36	\N	t	\N	945	\N	\N
16	4	4	10	2026-09-11 16:43:06	\N	f	947	\N	\N	\N
15	5	4	10	2026-09-11 16:43:06	\N	t	\N	947	\N	\N
18	4	3	11	2026-09-11 16:43:44	\N	f	946	\N	\N	\N
17	5	3	11	2026-09-11 16:43:44	\N	t	\N	946	\N	\N
26	4	6	16	2026-09-14 10:24:51	\N	f	949	\N	\N	\N
25	5	6	16	2026-09-14 10:24:51	\N	t	\N	949	\N	\N
29	4	6	18	2026-09-15 10:12:48	\N	t	949	\N	\N	\N
30	5	6	18	2026-09-15 10:12:48	\N	f	\N	949	\N	\N
28	4	5	17	2026-09-14 10:25:25	\N	f	948	\N	\N	\N
27	5	5	17	2026-09-14 10:25:25	\N	t	\N	948	\N	\N
31	4	5	19	2026-09-15 10:13:27	\N	t	948	\N	\N	\N
32	5	5	19	2026-09-15 10:13:27	\N	f	\N	948	\N	\N
33	4	2	20	2026-09-15 10:16:45	\N	t	945	\N	\N	\N
34	5	2	20	2026-09-15 10:16:45	\N	f	\N	945	\N	\N
35	4	3	21	2026-09-15 10:23:06	\N	t	946	\N	\N	\N
36	5	3	21	2026-09-15 10:23:06	\N	f	\N	946	\N	\N
37	4	4	22	2026-09-15 10:23:41	\N	t	947	\N	\N	\N
38	5	4	22	2026-09-15 10:23:41	\N	f	\N	947	\N	\N
39	4	7	23	2026-09-22 15:27:40	\N	f	969	\N		\N
40	4	8	24	2026-09-22 15:31:33	\N	f	970	\N		\N
41	4	9	25	2026-09-22 15:33:41	\N	f	971	\N		\N
42	4	10	26	2026-09-22 15:36:40	\N	f	972	\N		\N
43	4	11	27	2026-09-23 11:26:07	\N	f	973	\N		\N
44	4	12	28	2026-09-23 11:30:58	\N	f	974	\N		\N
45	4	7	29	2026-09-23 16:29:18	\N	t	969	\N	\N	\N
46	5	7	29	2026-09-23 16:29:18	\N	f	\N	969	\N	\N
47	4	9	30	2026-09-23 16:30:28	\N	t	971	\N	\N	\N
48	5	9	30	2026-09-23 16:30:28	\N	f	\N	971	\N	\N
49	4	8	31	2026-09-23 16:31:06	\N	t	970	\N	\N	\N
50	5	8	31	2026-09-23 16:31:06	\N	f	\N	970	\N	\N
51	4	10	32	2026-09-23 16:32:19	\N	t	972	\N	\N	\N
52	5	10	32	2026-09-23 16:32:19	\N	f	\N	972	\N	\N
53	4	11	33	2026-09-23 16:33:23	\N	t	973	\N	\N	\N
54	5	11	33	2026-09-23 16:33:23	\N	f	\N	973	\N	\N
55	4	12	34	2026-09-23 16:34:12	\N	t	974	\N	\N	\N
56	5	12	34	2026-09-23 16:34:12	\N	f	\N	974	\N	\N
57	5	11	35	2026-09-24 14:26:35	\N	t	\N	\N	\N	\N
58	4	11	35	2026-09-24 14:26:35	\N	f	\N	\N	\N	\N
59	5	8	36	2026-09-24 14:27:43	\N	t	\N	\N	\N	\N
60	4	8	36	2026-09-24 14:27:43	\N	f	\N	\N	\N	\N
61	5	9	37	2026-09-24 14:28:20	\N	t	\N	\N	\N	\N
62	4	9	37	2026-09-24 14:28:20	\N	f	\N	\N	\N	\N
63	5	7	38	2026-09-24 14:29:01	\N	t	\N	\N	\N	\N
64	4	7	38	2026-09-24 14:29:01	\N	f	\N	\N	\N	\N
65	5	12	39	2026-09-24 14:29:37	\N	t	\N	\N	\N	\N
66	4	12	39	2026-09-24 14:29:37	\N	f	\N	\N	\N	\N
67	5	10	40	2026-09-24 14:31:09	\N	t	\N	\N	\N	\N
68	4	10	40	2026-09-24 14:31:09	\N	f	\N	\N	\N	\N
69	4	13	41	2026-09-24 15:27:32	\N	f	987	\N		\N
70	4	11	42	2026-09-28 10:39:20	\N	t	\N	\N	\N	\N
71	5	11	42	2026-09-28 10:39:20	\N	f	\N	\N	\N	\N
72	4	8	43	2026-09-28 10:41:09	\N	t	\N	\N	\N	\N
73	5	8	43	2026-09-28 10:41:09	\N	f	\N	\N	\N	\N
74	4	9	44	2026-09-28 10:47:31	\N	t	\N	\N	\N	\N
75	5	9	44	2026-09-28 10:47:31	\N	f	\N	\N	\N	\N
76	4	7	45	2026-09-28 10:48:01	\N	t	\N	\N	\N	\N
77	5	7	45	2026-09-28 10:48:01	\N	f	\N	\N	\N	\N
78	4	12	46	2026-09-28 10:48:59	\N	t	\N	\N	\N	\N
79	5	12	46	2026-09-28 10:48:59	\N	f	\N	\N	\N	\N
80	4	14	47	2026-09-28 12:07:57	\N	f	992	\N		\N
81	4	15	48	2026-09-28 12:26:36	\N	f	993	\N		\N
82	4	16	49	2026-09-28 12:36:54	\N	f	994	\N		\N
83	4	17	50	2026-09-28 12:43:39	\N	f	995	\N		\N
84	4	18	51	2026-09-28 12:59:12	\N	f	996	\N		\N
85	4	19	52	2026-09-28 13:04:09	\N	f	997	\N		\N
86	4	13	53	2026-09-28 13:07:32	\N	t	\N	\N	\N	\N
87	5	13	53	2026-09-28 13:07:32	\N	f	\N	\N	\N	\N
88	4	14	54	2026-09-28 13:08:34	\N	t	\N	\N	\N	\N
89	5	14	54	2026-09-28 13:08:34	\N	f	\N	\N	\N	\N
90	4	15	55	2026-09-28 13:09:22	\N	t	\N	\N	\N	\N
91	5	15	55	2026-09-28 13:09:22	\N	f	\N	\N	\N	\N
92	4	16	56	2026-09-28 13:09:55	\N	t	\N	\N	\N	\N
93	5	16	56	2026-09-28 13:09:55	\N	f	\N	\N	\N	\N
94	4	17	57	2026-09-28 13:10:41	\N	t	\N	\N	\N	\N
95	5	17	57	2026-09-28 13:10:41	\N	f	\N	\N	\N	\N
96	5	17	58	2026-09-29 09:36:02	\N	t	\N	\N	\N	\N
97	4	17	58	2026-09-29 09:36:02	\N	f	\N	\N	\N	\N
98	5	14	59	2026-09-29 09:36:52	\N	t	\N	\N	\N	\N
99	4	14	59	2026-09-29 09:36:52	\N	f	\N	\N	\N	\N
100	5	16	60	2026-09-29 09:37:39	\N	t	\N	\N	\N	\N
101	4	16	60	2026-09-29 09:37:39	\N	f	\N	\N	\N	\N
102	5	15	61	2026-09-29 09:38:22	\N	t	\N	\N	\N	\N
103	4	15	61	2026-09-29 09:38:22	\N	f	\N	\N	\N	\N
104	5	13	62	2026-09-29 09:38:56	\N	t	\N	\N	\N	\N
105	4	13	62	2026-09-29 09:38:56	\N	f	\N	\N	\N	\N
106	5	9	63	2026-09-29 09:39:40	\N	t	\N	\N	\N	\N
107	4	9	63	2026-09-29 09:39:40	\N	f	\N	\N	\N	\N
108	5	7	64	2026-09-29 09:45:37	\N	t	\N	\N	\N	\N
109	4	7	64	2026-09-29 09:45:37	\N	f	\N	\N	\N	\N
110	4	18	65	2026-09-29 11:26:53	\N	t	\N	\N	\N	\N
111	5	18	65	2026-09-29 11:26:53	\N	f	\N	\N	\N	\N
112	4	19	66	2026-09-29 11:50:56	\N	t	997	\N	\N	\N
113	5	19	66	2026-09-29 11:50:56	\N	f	\N	997	\N	\N
114	5	18	67	2026-09-29 11:56:41	\N	t	\N	\N	\N	\N
115	4	18	67	2026-09-29 11:56:41	\N	f	\N	\N	\N	\N
116	5	19	68	2026-09-29 12:02:15	\N	t	\N	\N	\N	\N
117	4	19	68	2026-09-29 12:02:15	\N	f	\N	\N	\N	\N
118	4	20	69	2026-09-29 12:09:34	\N	f	1003	\N		\N
119	7	21	70	2026-09-30 11:48:28	\N	f	2661	\N		\N
120	7	22	71	2026-09-30 11:55:12	\N	f	2663	\N		\N
121	7	22	72	2026-09-30 15:06:31	\N	t	2661	\N	\N	\N
122	4	22	72	2026-09-30 15:06:31	\N	f	\N	2661	\N	\N
123	7	21	73	2026-09-30 15:18:56	\N	t	2661	\N	\N	\N
124	4	21	73	2026-09-30 15:18:56	\N	f	\N	2661	\N	\N
125	7	23	74	2026-09-30 15:24:31	\N	f	2664	\N		\N
126	7	24	75	2026-09-30 15:30:01	\N	f	2662	\N		\N
127	7	25	76	2026-09-30 15:36:50	\N	f	2683	\N		\N
130	4	21	78	2026-09-30 15:46:00	\N	t	\N	\N	\N	\N
131	7	21	78	2026-09-30 15:46:00	\N	f	\N	\N	\N	\N
129	7	22	77	2026-09-30 15:45:10	\N	f	2657	\N	\N	\N
128	4	22	77	2026-09-30 15:45:10	\N	t	\N	2657	\N	\N
132	7	25	79	2026-10-01 08:42:55	\N	t	2683	\N	\N	\N
133	4	25	79	2026-10-01 08:42:55	\N	f	\N	2683	\N	\N
134	7	24	80	2026-10-01 08:45:32	\N	t	2662	\N	\N	\N
135	4	24	80	2026-10-01 08:45:32	\N	f	\N	2662	\N	\N
136	7	23	81	2026-10-01 08:46:34	\N	t	2664	\N	\N	\N
137	4	23	81	2026-10-01 08:46:34	\N	f	\N	2664	\N	\N
138	4	26	82	2026-10-01 12:10:59	\N	f	1012	\N		\N
139	4	27	83	2026-10-01 13:18:16	\N	f	1013	\N		\N
140	4	26	84	2026-10-01 14:43:06	\N	t	\N	\N	\N	\N
141	7	26	84	2026-10-01 14:43:06	\N	f	\N	\N	\N	\N
142	4	27	85	2026-10-01 14:43:53	\N	t	\N	\N	\N	\N
143	7	27	85	2026-10-01 14:43:53	\N	f	\N	\N	\N	\N
144	4	28	86	2026-10-02 12:05:46	\N	f	1014	\N		\N
145	4	23	87	2026-10-02 12:20:07	\N	t	\N	\N	\N	\N
146	7	23	87	2026-10-02 12:20:07	\N	f	\N	\N	\N	\N
147	4	24	88	2026-10-02 12:20:37	\N	t	\N	\N	\N	\N
148	7	24	88	2026-10-02 12:20:37	\N	f	\N	\N	\N	\N
149	4	25	89	2026-10-02 12:21:04	\N	t	\N	\N	\N	\N
150	7	25	89	2026-10-02 12:21:04	\N	f	\N	\N	\N	\N
151	4	20	90	2026-10-02 12:23:25	\N	t	\N	\N	\N	\N
152	5	20	90	2026-10-02 12:23:25	\N	f	\N	\N	\N	\N
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: mesupres
--

COPY public.messages (id, courrier_id, expediteur_id, destinataire_id, created_at, deleted_at, date_validation, is_read_at, observation, numero_expediteur, numero_destinataire, is_traiter_at, bordureau) FROM stdin;
2	1	4	5	2026-09-10 10:51:28	\N	\N	2026-09-11 12:05:12	\N	943	\N	2026-09-11 12:09:33	\N
4	2	4	5	2026-09-11 10:03:35	\N	2026-09-11 16:42:36	2026-09-11 12:07:02	\N	945	\N	2026-09-11 16:42:36	\N
7	4	4	5	2026-09-11 11:00:52	\N	2026-09-11 16:43:06	2026-09-11 12:07:15	\N	947	\N	2026-09-11 16:43:06	\N
8	3	4	5	2026-09-11 11:42:37	\N	2026-09-11 16:43:44	2026-09-11 12:07:42	\N	946	\N	2026-09-11 16:43:44	\N
12	5	\N	4	2026-09-14 08:37:56	\N	2026-09-14 09:02:19	2026-09-14 08:37:56		\N	948	2026-09-14 09:02:19	\N
13	6	\N	4	2026-09-14 08:56:26	\N	2026-09-14 09:02:46	2026-09-14 08:56:26		\N	949	2026-09-14 09:02:46	\N
15	6	4	5	2026-09-14 09:02:46	\N	2026-09-14 10:24:51	2026-09-14 09:15:55	\N	949	\N	2026-09-14 10:24:51	\N
14	5	4	5	2026-09-14 09:02:19	\N	2026-09-14 10:25:25	2026-09-14 09:16:06	\N	948	\N	2026-09-14 10:25:25	\N
16	6	5	4	2026-09-14 10:24:51	\N	2026-09-15 10:12:48	2026-09-15 10:12:29	\N	\N	949	2026-09-15 10:12:48	\N
1	1	\N	4	2026-09-10 10:49:49	\N	2026-09-10 10:51:28	2026-09-10 10:49:49	Maître de Conférence	\N	943	2026-09-10 10:51:28	\N
17	5	5	4	2026-09-14 10:25:25	\N	2026-09-15 10:13:27	2026-09-15 10:13:16	\N	\N	948	2026-09-15 10:13:27	\N
9	2	5	4	2026-09-11 16:42:36	\N	2026-09-15 10:16:45	2026-09-14 09:07:00	\N	\N	945	2026-09-15 10:16:45	\N
3	2	\N	4	2026-09-11 10:01:52	\N	2026-09-11 10:03:35	2026-09-11 10:01:52		\N	945	2026-09-11 10:03:35	\N
11	3	5	4	2026-09-11 16:43:44	\N	2026-09-15 10:23:06	2026-09-14 09:08:49	\N	\N	946	2026-09-15 10:23:06	\N
10	4	5	4	2026-09-11 16:43:06	\N	2026-09-15 10:23:41	2026-09-14 09:08:19	\N	\N	947	2026-09-15 10:23:41	\N
18	6	4	5	2026-09-15 10:12:48	\N	\N	2026-09-15 10:24:31	\N	949	\N	2026-09-15 10:24:45	\N
19	5	4	5	2026-09-15 10:13:27	\N	\N	2026-09-15 10:25:12	\N	948	\N	2026-09-15 10:25:15	\N
6	4	\N	4	2026-09-11 10:22:17	\N	2026-09-11 11:00:52	2026-09-11 10:22:17		\N	947	2026-09-11 11:00:52	\N
5	3	\N	4	2026-09-11 10:09:54	\N	2026-09-11 11:42:37	2026-09-11 10:09:54		\N	946	2026-09-11 11:42:37	\N
20	2	4	5	2026-09-15 10:16:45	\N	\N	2026-09-15 10:25:33	\N	945	\N	2026-09-15 10:25:46	\N
21	3	4	5	2026-09-15 10:23:06	\N	\N	2026-09-15 10:26:05	\N	946	\N	2026-09-15 10:26:07	\N
22	4	4	5	2026-09-15 10:23:41	\N	\N	2026-09-15 10:26:26	\N	947	\N	2026-09-15 10:26:37	\N
23	7	\N	4	2026-09-22 15:27:40	\N	2026-09-23 16:29:18	2026-09-22 15:27:40		\N	969	2026-09-23 16:29:18	\N
25	9	\N	4	2026-09-22 15:33:41	\N	2026-09-23 16:30:28	2026-09-22 15:33:41		\N	971	2026-09-23 16:30:28	\N
24	8	\N	4	2026-09-22 15:31:33	\N	2026-09-23 16:31:06	2026-09-22 15:31:33		\N	970	2026-09-23 16:31:06	\N
51	18	\N	4	2026-09-28 12:59:12	\N	2026-09-29 11:26:53	2026-09-28 12:59:12		\N	996	2026-09-29 11:26:53	\N
26	10	\N	4	2026-09-22 15:36:40	\N	2026-09-23 16:32:19	2026-09-22 15:36:40		\N	972	2026-09-23 16:32:19	\N
64	7	5	4	2026-09-29 09:45:37	\N	\N	2026-09-29 12:20:54	\N	\N	\N	2026-09-30 11:27:53	\N
27	11	\N	4	2026-09-23 11:26:07	\N	2026-09-23 16:33:23	2026-09-23 11:26:07		\N	973	2026-09-23 16:33:23	\N
28	12	\N	4	2026-09-23 11:30:58	\N	2026-09-23 16:34:12	2026-09-23 11:30:58		\N	974	2026-09-23 16:34:12	\N
52	19	\N	4	2026-09-28 13:04:09	\N	2026-09-29 11:50:56	2026-09-28 13:04:09		\N	997	2026-09-29 11:50:56	\N
63	9	5	4	2026-09-29 09:39:40	\N	\N	2026-09-29 12:20:35	\N	\N	\N	2026-09-30 11:28:07	\N
40	10	5	4	2026-09-24 14:31:09	\N	\N	2026-09-29 12:22:45	\N	\N	\N	2026-09-30 11:28:21	\N
33	11	4	5	2026-09-23 16:33:23	\N	2026-09-24 14:26:35	2026-09-24 14:21:46	\N	973	\N	2026-09-24 14:26:35	\N
31	8	4	5	2026-09-23 16:31:06	\N	2026-09-24 14:27:43	2026-09-24 14:24:54	\N	970	\N	2026-09-24 14:27:43	\N
30	9	4	5	2026-09-23 16:30:28	\N	2026-09-24 14:28:20	2026-09-24 14:24:14	\N	971	\N	2026-09-24 14:28:20	\N
29	7	4	5	2026-09-23 16:29:18	\N	2026-09-24 14:29:01	2026-09-24 14:23:15	\N	969	\N	2026-09-24 14:29:01	\N
34	12	4	5	2026-09-23 16:34:12	\N	2026-09-24 14:29:37	2026-09-24 14:19:43	\N	974	\N	2026-09-24 14:29:37	\N
32	10	4	5	2026-09-23 16:32:19	\N	2026-09-24 14:31:09	2026-09-24 14:25:22	\N	972	\N	2026-09-24 14:31:09	\N
62	13	5	4	2026-09-29 09:38:56	\N	\N	2026-09-29 12:20:11	\N	\N	\N	2026-09-30 11:28:44	\N
41	13	\N	4	2026-09-24 15:27:32	\N	2026-09-28 13:07:32	2026-09-24 15:27:32		\N	987	2026-09-28 13:07:32	\N
47	14	\N	4	2026-09-28 12:07:57	\N	2026-09-28 13:08:34	2026-09-28 12:07:57		\N	992	2026-09-28 13:08:34	\N
65	18	4	5	2026-09-29 11:26:53	\N	2026-09-29 11:56:41	2026-09-29 11:32:31	\N	\N	\N	2026-09-29 11:56:41	\N
35	11	5	4	2026-09-24 14:26:35	\N	2026-09-28 10:39:20	2026-09-24 15:13:18	\N	\N	\N	2026-09-28 10:39:20	\N
36	8	5	4	2026-09-24 14:27:43	\N	2026-09-28 10:41:09	2026-09-24 15:14:04	\N	\N	\N	2026-09-28 10:41:09	\N
37	9	5	4	2026-09-24 14:28:20	\N	2026-09-28 10:47:31	2026-09-24 15:15:06	\N	\N	\N	2026-09-28 10:47:31	\N
38	7	5	4	2026-09-24 14:29:01	\N	2026-09-28 10:48:01	2026-09-24 15:16:15	\N	\N	\N	2026-09-28 10:48:01	\N
48	15	\N	4	2026-09-28 12:26:36	\N	2026-09-28 13:09:22	2026-09-28 12:26:36		\N	993	2026-09-28 13:09:22	\N
39	12	5	4	2026-09-24 14:29:37	\N	2026-09-28 10:48:59	2026-09-24 15:19:17	\N	\N	\N	2026-09-28 10:48:59	\N
59	14	5	4	2026-09-29 09:36:52	\N	\N	2026-09-29 12:18:40	\N	\N	\N	2026-09-30 11:28:55	\N
61	15	5	4	2026-09-29 09:38:22	\N	\N	2026-09-29 12:19:47	\N	\N	\N	2026-09-30 11:29:15	\N
49	16	\N	4	2026-09-28 12:36:54	\N	2026-09-28 13:09:55	2026-09-28 12:36:54		\N	994	2026-09-28 13:09:55	\N
46	12	4	5	2026-09-28 10:48:59	\N	\N	2026-09-28 10:52:28	\N	\N	\N	2026-09-28 10:54:07	\N
43	8	4	5	2026-09-28 10:41:09	\N	\N	2026-09-28 10:48:33	\N	\N	\N	2026-09-28 10:58:22	\N
42	11	4	5	2026-09-28 10:39:20	\N	\N	2026-09-28 10:48:19	\N	\N	\N	2026-09-28 10:58:37	\N
66	19	4	5	2026-09-29 11:50:56	\N	2026-09-29 12:02:15	2026-09-29 11:58:50	\N	997	\N	2026-09-29 12:02:15	\N
50	17	\N	4	2026-09-28 12:43:39	\N	2026-09-28 13:10:41	2026-09-28 12:43:39		\N	995	2026-09-28 13:10:41	\N
60	16	5	4	2026-09-29 09:37:39	\N	\N	2026-09-29 12:19:06	\N	\N	\N	2026-09-30 11:29:26	\N
71	22	\N	7	2026-09-30 11:55:12	\N	2026-09-30 15:06:31	2026-09-30 11:55:12		\N	2663	2026-09-30 15:06:31	\N
57	17	4	5	2026-09-28 13:10:41	\N	2026-09-29 09:36:02	2026-09-28 14:54:10	\N	\N	\N	2026-09-29 09:36:02	\N
54	14	4	5	2026-09-28 13:08:34	\N	2026-09-29 09:36:52	2026-09-28 14:53:02	\N	\N	\N	2026-09-29 09:36:52	\N
56	16	4	5	2026-09-28 13:09:55	\N	2026-09-29 09:37:39	2026-09-28 14:53:49	\N	\N	\N	2026-09-29 09:37:39	\N
55	15	4	5	2026-09-28 13:09:22	\N	2026-09-29 09:38:22	2026-09-28 14:53:27	\N	\N	\N	2026-09-29 09:38:22	\N
53	13	4	5	2026-09-28 13:07:32	\N	2026-09-29 09:38:56	2026-09-28 14:52:28	\N	\N	\N	2026-09-29 09:38:56	\N
44	9	4	5	2026-09-28 10:47:31	\N	2026-09-29 09:39:40	2026-09-28 10:51:18	\N	\N	\N	2026-09-29 09:39:40	\N
45	7	4	5	2026-09-28 10:48:01	\N	2026-09-29 09:45:37	2026-09-28 10:51:44	\N	\N	\N	2026-09-29 09:45:37	\N
73	21	7	4	2026-09-30 15:18:56	\N	2026-09-30 15:46:00	2026-09-30 15:45:50	\N	2661	\N	2026-09-30 15:46:00	\N
70	21	\N	7	2026-09-30 11:48:28	\N	2026-09-30 15:18:56	2026-09-30 11:48:28		\N	2661	2026-09-30 15:18:56	\N
76	25	\N	7	2026-09-30 15:36:50	\N	2026-10-01 08:42:55	2026-09-30 15:36:50		\N	2683	2026-10-01 08:42:55	\N
90	20	4	5	2026-10-02 12:23:25	\N	\N	\N	\N	\N	\N	\N	\N
58	17	5	4	2026-09-29 09:36:02	\N	\N	2026-09-29 12:17:47	\N	\N	\N	2026-09-30 11:29:38	\N
67	18	5	4	2026-09-29 11:56:41	\N	\N	2026-09-29 12:21:13	\N	\N	\N	2026-09-30 11:29:56	\N
68	19	5	4	2026-09-29 12:02:15	\N	\N	2026-09-29 12:21:33	\N	\N	\N	2026-09-30 11:30:15	\N
88	24	4	7	2026-10-02 12:20:37	\N	\N	\N	\N	\N	\N	\N	\N
77	22	4	7	2026-09-30 15:45:10	\N	\N	2026-10-01 08:31:01	\N	\N	2657	2026-10-01 08:34:04	\N
78	21	4	7	2026-09-30 15:46:00	\N	\N	2026-10-01 08:35:43	\N	\N	\N	2026-10-01 08:35:43	\N
72	22	7	4	2026-09-30 15:06:31	\N	2026-09-30 15:45:10	2026-09-30 15:44:06	\N	2661	\N	2026-09-30 15:45:10	\N
75	24	\N	7	2026-09-30 15:30:01	\N	2026-10-01 08:45:32	2026-09-30 15:30:01		\N	2662	2026-10-01 08:45:32	\N
74	23	\N	7	2026-09-30 15:24:31	\N	2026-10-01 08:46:34	2026-09-30 15:24:31		\N	2664	2026-10-01 08:46:34	\N
89	25	4	7	2026-10-02 12:21:04	\N	\N	\N	\N	\N	\N	\N	\N
85	27	4	7	2026-10-01 14:43:53	\N	\N	\N	\N	\N	\N	\N	\N
84	26	4	7	2026-10-01 14:43:06	\N	\N	\N	\N	\N	\N	\N	\N
82	26	\N	4	2026-10-01 12:10:59	\N	2026-10-01 14:43:06	2026-10-01 12:10:59		\N	1012	2026-10-01 14:43:06	\N
83	27	\N	4	2026-10-01 13:18:16	\N	2026-10-01 14:43:53	2026-10-01 13:18:16		\N	1013	2026-10-01 14:43:53	\N
87	23	4	7	2026-10-02 12:20:07	\N	\N	\N	\N	\N	\N	\N	\N
86	28	\N	4	2026-10-02 12:05:46	\N	\N	2026-10-02 12:05:46		\N	1014	\N	\N
81	23	7	4	2026-10-01 08:46:34	\N	2026-10-02 12:20:07	2026-10-01 12:05:31	\N	2664	\N	2026-10-02 12:20:07	\N
80	24	7	4	2026-10-01 08:45:32	\N	2026-10-02 12:20:37	2026-10-01 12:05:00	\N	2662	\N	2026-10-02 12:20:37	\N
79	25	7	4	2026-10-01 08:42:55	\N	2026-10-02 12:21:04	2026-10-01 11:58:48	\N	2683	\N	2026-10-02 12:21:04	\N
69	20	\N	4	2026-09-29 12:09:34	\N	2026-10-02 12:23:25	2026-09-29 12:09:34		\N	1003	2026-10-02 12:23:25	\N
\.


--
-- Data for Name: numero_courriers; Type: TABLE DATA; Schema: public; Owner: mesupres
--

COPY public.numero_courriers (id, utilisateur_id, created_at, deleted_at, numero, is_send) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: mesupres
--

COPY public.roles (id, created_at, deleted_at, name) FROM stdin;
1	2026-08-18 09:33:49	\N	Admin
2	2026-08-18 09:33:49	\N	Utilisateur
3	2026-08-18 09:33:49	\N	Externe
\.


--
-- Data for Name: utilisateurs; Type: TABLE DATA; Schema: public; Owner: mesupres
--

COPY public.utilisateurs (id, role_id, created_at, deleted_at, email, mdp, nom, prenom, adresse, sigle, date_inactif) FROM stdin;
2	3	2026-09-06 18:22:32	\N	externe@gmail.com	externe	Externe	\N	Externe	\N	\N
1	1	2026-09-06 18:22:18	\N	admin@gmail.com	$2y$10$w8sUqIANWuDJpoB4zTzkee7/v6clEMSWyqWoKhnECEmZIMiKJkoL.	ADMIN	\N	Admin	\N	\N
3	1	2026-09-07 09:40:04	\N	dsint@mesupres.mg	$2y$10$dvMdwJkfBp9nN0ImI4dfDOXyg2XWkVkJaef1fWF0tZE4.bA5qFT.q	RASOAMANANA	Radoniaina Andriantsiresy	MESUPRES - Rue Andriamanantena Georges, Fiadanana	\N	\N
5	2	2026-09-07 09:52:39	\N	sg.sag@mesupres.mg	$2y$10$WVw3TXMZcBXtCrC02.vBG.CoEgsBSGpD.AHOgPlvysLUGDMCy0cja	SECRÉTARIAT GÉNÉRAL / SERVICES DES AFFAIRES GENERALES (SAG)	\N	MESUPRES - 2eme étage Porte 111 Bureau SAG - Rue Andriamanantena Georges, Fiadanana	SG/SAG	\N
8	2	2026-09-22 19:17:14	\N	presidence@univ-antananarivo.mg	$2y$10$tF1wxM27.r.43jQWZrMePOaNhsseUOkb6J36jWHqVWa9cK2Kh.YJK	UNIVERSITÉ D'ANTANANARIVO/PROTOCOLE	\N	Présidence de l'Université d'Antananarivo - 2eme étage - Protocole - Ambohitsaina	UA/PROT	\N
6	1	2026-09-08 17:27:13	\N	dsint.ssi@mesupres.mg	$2y$10$EyGfUFLoE5aB0eB0D3mosuRJjXib4ORN3s/TQ.bDToGmciMQQNrGS	RAKOTOARIMANGA	Samuel	MESUPRES - Rue Andriamanantena Georges, Fiadanana	\N	\N
7	2	2026-09-09 14:57:10	\N	drh@mesupres.mg	$2y$10$0ZRK.iWPiwwJVKgljFDBP.WHWX6Eio3zrtvJi7Li66RHt2RRx5YMa	DIRECTION DES RESSOURCES HUMAINES	\N	MESUPRES - Bâtiment annexe 1ere étage Porte 103 - Rue Andriamanantena Georges, Fiadanana	DRH	\N
4	2	2026-09-07 09:48:47	\N	sgsp.mesupres@mesupres.mg	$2y$10$YseXAgdGCZeUAmBJGAQKm..pKE0zWSiS4aLriVARNyEqumrdVkWO.	SECRÉTARIAT GÉNÉRAL	\N	MESUPRES - Rez de chaussée Porte 6 bureau SG - Rue Andriamanantena Georges, Fiadanana	SG	\N
\.


--
-- Name: courrier_validations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mesupres
--

SELECT pg_catalog.setval('public.courrier_validations_id_seq', 1, false);


--
-- Name: courriers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mesupres
--

SELECT pg_catalog.setval('public.courriers_id_seq', 28, true);


--
-- Name: detail_personnes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mesupres
--

SELECT pg_catalog.setval('public.detail_personnes_id_seq', 31, true);


--
-- Name: employeurs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mesupres
--

SELECT pg_catalog.setval('public.employeurs_id_seq', 1, false);


--
-- Name: entites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mesupres
--

SELECT pg_catalog.setval('public.entites_id_seq', 1, false);


--
-- Name: fichiers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mesupres
--

SELECT pg_catalog.setval('public.fichiers_id_seq', 10, true);


--
-- Name: historiques_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mesupres
--

SELECT pg_catalog.setval('public.historiques_id_seq', 152, true);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mesupres
--

SELECT pg_catalog.setval('public.messages_id_seq', 90, true);


--
-- Name: numero_courriers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mesupres
--

SELECT pg_catalog.setval('public.numero_courriers_id_seq', 1, false);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mesupres
--

SELECT pg_catalog.setval('public.roles_id_seq', 1, false);


--
-- Name: utilisateurs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: mesupres
--

SELECT pg_catalog.setval('public.utilisateurs_id_seq', 8, true);


--
-- Name: courrier_validations courrier_validations_pkey; Type: CONSTRAINT; Schema: public; Owner: mesupres
--

ALTER TABLE ONLY public.courrier_validations
    ADD CONSTRAINT courrier_validations_pkey PRIMARY KEY (id);


--
-- Name: courriers courriers_pkey; Type: CONSTRAINT; Schema: public; Owner: mesupres
--

ALTER TABLE ONLY public.courriers
    ADD CONSTRAINT courriers_pkey PRIMARY KEY (id);


--
-- Name: detail_personnes detail_personnes_pkey; Type: CONSTRAINT; Schema: public; Owner: mesupres
--

ALTER TABLE ONLY public.detail_personnes
    ADD CONSTRAINT detail_personnes_pkey PRIMARY KEY (id);


--
-- Name: doctrine_migration_versions doctrine_migration_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: mesupres
--

ALTER TABLE ONLY public.doctrine_migration_versions
    ADD CONSTRAINT doctrine_migration_versions_pkey PRIMARY KEY (version);


--
-- Name: employeurs employeurs_pkey; Type: CONSTRAINT; Schema: public; Owner: mesupres
--

ALTER TABLE ONLY public.employeurs
    ADD CONSTRAINT employeurs_pkey PRIMARY KEY (id);


--
-- Name: entites entites_pkey; Type: CONSTRAINT; Schema: public; Owner: mesupres
--

ALTER TABLE ONLY public.entites
    ADD CONSTRAINT entites_pkey PRIMARY KEY (id);


--
-- Name: fichiers fichiers_pkey; Type: CONSTRAINT; Schema: public; Owner: mesupres
--

ALTER TABLE ONLY public.fichiers
    ADD CONSTRAINT fichiers_pkey PRIMARY KEY (id);


--
-- Name: historiques historiques_pkey; Type: CONSTRAINT; Schema: public; Owner: mesupres
--

ALTER TABLE ONLY public.historiques
    ADD CONSTRAINT historiques_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: mesupres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: numero_courriers numero_courriers_pkey; Type: CONSTRAINT; Schema: public; Owner: mesupres
--

ALTER TABLE ONLY public.numero_courriers
    ADD CONSTRAINT numero_courriers_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: mesupres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: utilisateurs utilisateurs_pkey; Type: CONSTRAINT; Schema: public; Owner: mesupres
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_pkey PRIMARY KEY (id);


--
-- Name: idx_1057365073a201e5; Type: INDEX; Schema: public; Owner: mesupres
--

CREATE INDEX idx_1057365073a201e5 ON public.courrier_validations USING btree (createur_id);


--
-- Name: idx_2db3718173a201e5; Type: INDEX; Schema: public; Owner: mesupres
--

CREATE INDEX idx_2db3718173a201e5 ON public.courriers USING btree (createur_id);


--
-- Name: idx_2db37181d596d79f; Type: INDEX; Schema: public; Owner: mesupres
--

CREATE INDEX idx_2db37181d596d79f ON public.courriers USING btree (cloture_par_id);


--
-- Name: idx_3a432b9e5d7c53ec; Type: INDEX; Schema: public; Owner: mesupres
--

CREATE INDEX idx_3a432b9e5d7c53ec ON public.detail_personnes USING btree (employeur_id);


--
-- Name: idx_3a432b9e8bf41dc7; Type: INDEX; Schema: public; Owner: mesupres
--

CREATE INDEX idx_3a432b9e8bf41dc7 ON public.detail_personnes USING btree (courrier_id);


--
-- Name: idx_3a432b9e9bea957a; Type: INDEX; Schema: public; Owner: mesupres
--

CREATE INDEX idx_3a432b9e9bea957a ON public.detail_personnes USING btree (entite_id);


--
-- Name: idx_497b315ed60322ac; Type: INDEX; Schema: public; Owner: mesupres
--

CREATE INDEX idx_497b315ed60322ac ON public.utilisateurs USING btree (role_id);


--
-- Name: idx_60a0071efb88e14f; Type: INDEX; Schema: public; Owner: mesupres
--

CREATE INDEX idx_60a0071efb88e14f ON public.numero_courriers USING btree (utilisateur_id);


--
-- Name: idx_969db4ab537a1329; Type: INDEX; Schema: public; Owner: mesupres
--

CREATE INDEX idx_969db4ab537a1329 ON public.fichiers USING btree (message_id);


--
-- Name: idx_b25fde8d537a1329; Type: INDEX; Schema: public; Owner: mesupres
--

CREATE INDEX idx_b25fde8d537a1329 ON public.historiques USING btree (message_id);


--
-- Name: idx_b25fde8d8bf41dc7; Type: INDEX; Schema: public; Owner: mesupres
--

CREATE INDEX idx_b25fde8d8bf41dc7 ON public.historiques USING btree (courrier_id);


--
-- Name: idx_b25fde8dfb88e14f; Type: INDEX; Schema: public; Owner: mesupres
--

CREATE INDEX idx_b25fde8dfb88e14f ON public.historiques USING btree (utilisateur_id);


--
-- Name: idx_db021e9610335f61; Type: INDEX; Schema: public; Owner: mesupres
--

CREATE INDEX idx_db021e9610335f61 ON public.messages USING btree (expediteur_id);


--
-- Name: idx_db021e968bf41dc7; Type: INDEX; Schema: public; Owner: mesupres
--

CREATE INDEX idx_db021e968bf41dc7 ON public.messages USING btree (courrier_id);


--
-- Name: idx_db021e96a4f84f6e; Type: INDEX; Schema: public; Owner: mesupres
--

CREATE INDEX idx_db021e96a4f84f6e ON public.messages USING btree (destinataire_id);


--
-- Name: courrier_validations fk_1057365073a201e5; Type: FK CONSTRAINT; Schema: public; Owner: mesupres
--

ALTER TABLE ONLY public.courrier_validations
    ADD CONSTRAINT fk_1057365073a201e5 FOREIGN KEY (createur_id) REFERENCES public.utilisateurs(id);


--
-- Name: courriers fk_2db3718173a201e5; Type: FK CONSTRAINT; Schema: public; Owner: mesupres
--

ALTER TABLE ONLY public.courriers
    ADD CONSTRAINT fk_2db3718173a201e5 FOREIGN KEY (createur_id) REFERENCES public.utilisateurs(id);


--
-- Name: courriers fk_2db37181d596d79f; Type: FK CONSTRAINT; Schema: public; Owner: mesupres
--

ALTER TABLE ONLY public.courriers
    ADD CONSTRAINT fk_2db37181d596d79f FOREIGN KEY (cloture_par_id) REFERENCES public.utilisateurs(id);


--
-- Name: detail_personnes fk_3a432b9e5d7c53ec; Type: FK CONSTRAINT; Schema: public; Owner: mesupres
--

ALTER TABLE ONLY public.detail_personnes
    ADD CONSTRAINT fk_3a432b9e5d7c53ec FOREIGN KEY (employeur_id) REFERENCES public.employeurs(id);


--
-- Name: detail_personnes fk_3a432b9e8bf41dc7; Type: FK CONSTRAINT; Schema: public; Owner: mesupres
--

ALTER TABLE ONLY public.detail_personnes
    ADD CONSTRAINT fk_3a432b9e8bf41dc7 FOREIGN KEY (courrier_id) REFERENCES public.courriers(id);


--
-- Name: detail_personnes fk_3a432b9e9bea957a; Type: FK CONSTRAINT; Schema: public; Owner: mesupres
--

ALTER TABLE ONLY public.detail_personnes
    ADD CONSTRAINT fk_3a432b9e9bea957a FOREIGN KEY (entite_id) REFERENCES public.entites(id);


--
-- Name: utilisateurs fk_497b315ed60322ac; Type: FK CONSTRAINT; Schema: public; Owner: mesupres
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT fk_497b315ed60322ac FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- Name: numero_courriers fk_60a0071efb88e14f; Type: FK CONSTRAINT; Schema: public; Owner: mesupres
--

ALTER TABLE ONLY public.numero_courriers
    ADD CONSTRAINT fk_60a0071efb88e14f FOREIGN KEY (utilisateur_id) REFERENCES public.utilisateurs(id);


--
-- Name: fichiers fk_969db4ab537a1329; Type: FK CONSTRAINT; Schema: public; Owner: mesupres
--

ALTER TABLE ONLY public.fichiers
    ADD CONSTRAINT fk_969db4ab537a1329 FOREIGN KEY (message_id) REFERENCES public.messages(id) ON DELETE CASCADE;


--
-- Name: historiques fk_b25fde8d537a1329; Type: FK CONSTRAINT; Schema: public; Owner: mesupres
--

ALTER TABLE ONLY public.historiques
    ADD CONSTRAINT fk_b25fde8d537a1329 FOREIGN KEY (message_id) REFERENCES public.messages(id);


--
-- Name: historiques fk_b25fde8d8bf41dc7; Type: FK CONSTRAINT; Schema: public; Owner: mesupres
--

ALTER TABLE ONLY public.historiques
    ADD CONSTRAINT fk_b25fde8d8bf41dc7 FOREIGN KEY (courrier_id) REFERENCES public.courriers(id);


--
-- Name: historiques fk_b25fde8dfb88e14f; Type: FK CONSTRAINT; Schema: public; Owner: mesupres
--

ALTER TABLE ONLY public.historiques
    ADD CONSTRAINT fk_b25fde8dfb88e14f FOREIGN KEY (utilisateur_id) REFERENCES public.utilisateurs(id);


--
-- Name: messages fk_db021e9610335f61; Type: FK CONSTRAINT; Schema: public; Owner: mesupres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT fk_db021e9610335f61 FOREIGN KEY (expediteur_id) REFERENCES public.utilisateurs(id);


--
-- Name: messages fk_db021e968bf41dc7; Type: FK CONSTRAINT; Schema: public; Owner: mesupres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT fk_db021e968bf41dc7 FOREIGN KEY (courrier_id) REFERENCES public.courriers(id);


--
-- Name: messages fk_db021e96a4f84f6e; Type: FK CONSTRAINT; Schema: public; Owner: mesupres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT fk_db021e96a4f84f6e FOREIGN KEY (destinataire_id) REFERENCES public.utilisateurs(id);


--
-- PostgreSQL database dump complete
--

\unrestrict TmZmqAzgaV24fqY3rl1qKDEHeijFDOq4UT9CISS3LNuaAXexFX52YZwFcjkOX7q

