/**
    Apep port of the post modernism generator.
*/
// pomo.pb  acb  ??-09-24 AU
// pb script for generating postmodern verbiage
// Updated, format-independent version
// Copyright (C) 1995, 1996 Andrew C. Bulhak
// this script is property of acb. You are permitted to use, modify and
// distribute it as long as this notice is retained and any modifications
// in distributed copies are clearly denoted.
const pep = require('apep');
const pep_sep = require('apep-std-sep');
const pep_trans = require('apep-std-transformations');
const pep_vars = require('apep-std-vars');
const md = require('apep-md');

/**
    Sentence level capitalization.
*/
const capitalize = (g) => pep_trans.capitalizeFirst(pep.join(g));

const H2 = pep_sep.between('## ', '\n');

////////////////////////////////////////////////////////////////////////////////
// Transforms
const trim_e = pep_trans.replace(/e$/, '');

const strip_the = pep_trans.replace(/^the /i, '');

const pluralise = pep_trans.match()
    .case(/(.*)y$/,   (_, x) => x + 'ies')
    .case(/(.*s)$/,   (_, x) => x + 'es')
    .case(/.*/,       (x) => x + 's');

const past_tensify = pep_trans.match()
    .case(/.*e$/,     (x) => x + 'd')
    .case(/.*/,       (x) => x + 'ed');

const PBRK = pep.str('\n\n');

////////////////////////////////////////////////////////////////////////////////
// 
const output = pep.declare(() =>
    pep.seq(
       // PROLOGUE,
        /*TITLE(*/ '\n# ', capitalize(title), '\n',
        formatted_authors, '\n\n',
        //BODY,
        sections
        //EPILOGUE
        ));

////////////////////////////////////////////////////////////////////////////////
// Title
const title = pep.declare(() =>
    pep.choice(
        capitalize(title2),
        [candid_title, ": ", capitalize(title2)]));

const title2 = pep.declare(() =>
    pep.choice(
        [pep_vars.store('vSubject', new_term), " in the works of ",
            pep_vars.store('vCitable', citable_artist)],
        
        [pep_vars.store('vSubject', new_term), " in the works of ", artist],
        
        [pep_vars.store('vSubject2', new_term), " in the works of ",
            pep_vars.store('vCitable', citable_artist)],
        
        p_two_term_title(
            pep_vars.store('vSubject', pep.choice(
                new_term, 
                ideology,
                art_movement)),
            pep_vars.store('vSubject2', new_term)),
        
        p_three_term_title(
            pep_vars.store('vSubject', art_movement),
            pep_vars.store('vSubject2', ideology),
            new_term)));

const p_two_term_title = (foo, bar) =>
    pep.choice(
        [foo, " and ", bar],
        [bar, " and ", foo]);

const p_three_term_title = (foo, bar, baz) =>
    pep.choice(
        [foo, ", ", bar, " and ", baz], 
	    [foo, ", ", baz, " and ", bar],
	    [bar, ", ", foo, " and ", baz],
	    [bar, ", ", baz, " and ", foo],
	    [baz, ", ", foo, " and ", bar],
	    [baz, ", ", bar, " and ", foo]);

const candid_title = pep.declare(() =>
    pep.choice(
        [capitalize(doing_something_to), " ", intellectual],
        [capitalize(adj), " ", abst_noun, capitalize(pluralise(abst_noun))],
        ["The ", capitalize(concrete_adj), " ", capitalize(concrete_noun)],
        ["The ", capitalize(something_of_2), " of ",
            capitalize(big_nebulous_thing)],
        ["The ", capitalize(something_of_2), " of ", capitalize(big_thing)],
        ["The ", capitalize(big_nebulous_thing), " of ",
            capitalize(something_of_2)],
        [capitalize(pluralise(big_nebulous_thing)), " of ",
            capitalize(something_of_2)],
        [capitalize(doing_something_to_movement), " ",
            capitalize(art_movement)]));

////////////////////////////////////////////////////////////////////////////////
// 
const concrete_adj = pep.choice(
    "vermillion",
    "circular",
    "broken",
    "forgotten",
    "stone",
    "iron",
    "burning");
    
// symbolic-type objects
const concrete_noun = pep.choice(
    "door",
    "fruit",
    "key",
    "sky",
    "sea",
    "house");

const doing_something_to = pep.choice(
    "reading",
    "deconstructing",
    "forgetting");

const doing_something_to_movement = pep.choice(
    "reinventing",
    "deconstructing",
    "reassessing");

////////////////////////////////////////////////////////////////////////////////
// Author
const paper_author = pep.declare(() =>
    /*AUTHOR_INST*/pep.seq(name, ' ', department, ", ", acad_institution));

const paper_authors = pep_sep.sepMany1('\n', paper_author);

const formatted_authors = paper_authors;

const department = pep.declare(() =>
    pep.seq("Department of ", dept_topic));

const dept_topic = pep.choice(
    "English",
    "Literature",
    "Politics",
    "Sociology",
    "English",
    "Literature",
    "Politics",
    "Sociology",
    "Gender Politics",
    "Peace Studies",
    "Future Studies",
    "Ontology",
    "Semiotics",
    "Deconstruction",
    "Sociolinguistics");

const acad_institution = pep.declare(() =>
    pep.choice(
        "Massachusetts Institute of Technology",
        "Stanford University",
        "Carnegie-Mellon University",
        "University of California, Berkeley",
        "University of Illinois",
        "University of Massachusetts, Amherst",
        ["University of ", university_of],
        ["University of ", university_of],
        [something_university, " University"],
        [something_university, " University"],
        "Miskatonic University, Arkham, Mass."));

const university_of = pep.choice(
    "California",
    "Illinois",
    "Georgia",
    "Massachusetts",
    "Michigan",
    "North Carolina",
    "Oregon");

const something_university = pep.choice(
    "Oxford",
    "Harvard",
    "Cambridge", 
    "Yale");

////////////////////////////////////////////////////////////////////////////////
// Sections
const sections = pep.declare(() =>
    pep.many1(section));

const section = pep.declare(() =>
    pep.seq(
        H2(section_title),
        paragraphs));

const section_title = pep.declare(() =>
    pep.choice(
        [term, " and ", pep_vars.setFrom('vSubject3', new_term)],
        [pep_vars.store('vCitable', citable_artist), " and ", term],
        [pluralise(big_nebulous_thing), " of ", something_of_2]));

const paragraphs = pep.declare(() =>
    md.paragraphs(
        intro_paragraph,
        paragraphs_2));

const paragraphs_2 = pep.declare(() =>
    pep.choice(
        md.paragraphs(
            paragraphs,
            paragraph),
                
        md.paragraphs(
            paragraphs,
            paragraph),
            
        md.paragraphs(
            paragraphs,
            paragraph),
            
        md.paragraphs(
            paragraph,
            paragraph,
            "--------",
            paragraph),
            
        pep.seq(
            paragraph,
            PBRK,
            paragraph)));

const intro_paragraph = pep.declare(() =>
    pep.seq(
        intro_sentence,
        paragraph));

const paragraph = pep.declare(() =>
    pep.choice(
        pep.seq(
            paragraph,
            sentence),
        sentence));

////////////////////////////////////////////////////////////////////////////////
// sentence
const sentence = pep.declare(() =>
    pep.choice(
        capitalize(sentence2),
        [capitalize(preamble), sentence2]));

const sentence2 = pep.declare(() =>
    pep.choice(
        [assumption, " ", implies_that, result, ". "],
        [intellectual, " uses the term '", term, "' to denote ",
            concept_desc, ". "],
        [justifier, "we have to choose between ", term, " and ", term, ". "],
        ["the ", main, " theme of ", work, " is ", concept_desc, ". "],
        [intellectual, " ", promotes, " the use of ", term, " to ",
            imper_vp, ". "],
        [plural_numeric_adj, " ", pluralise(abst_noun), abst_description, " ", 
            exist, ". "],
        sentence_about_citable_artist(
            pep_vars.store('vCitable', citable_artist)),
        ["the subject is ", past_tensify(neut_verb), " into a ",
            strip_the(term), " that includes ", big_abst_thing, " as a ", 
            big_singular_thing, ". "]));

////////////////////////////////////////////////////////////////////////////////
// Introduction sentences
const p_intro_sent_thing_state = (th, st) =>
    pep.seq(
        "\"", capitalize(th), " is ", st, '," says ', intellectual,
        "; however, according to ", pep_vars.setFrom('foo', generic_surname),
        footnote_cite(pep.get('foo')), ", it is not so much ", th, " that is ",
        st, ", but rather the ", something_of, " of ", th, ". ");

const intro_sentence = pep.declare(() =>
    capitalize(intro_sentence2));

const intro_sentence2 = pep.declare(() =>
    pep.choice(
        ['"', capitalize(pseudo_quote), '," says ', intellectual, ". "],
        [p_intro_sent_thing_state(big_thing, state_of_being)],
	    ["If one examines ", term, ", one is faced with a choice: either ",
            accept_or_reject, " ", term, " or conclude that ", result, ". "],
	    ["In the works of ", pep_vars.store('vCitable', citable_artist),
	        ", a predominant concept is ", predominant_concept, ". "],
	    ["the ", main, " theme of ", work, " is ", concept_desc, ". "]));

const predominant_concept = pep.declare(() =>
    pep.choice(
        ["the distinction between ", pep_vars.setFrom('foo', dualisable_word),
            " and ", opposite(pep.get('foo'))],
        ["the concept of ", adj, " ", big_abst_thing]));

const pseudo_quote = pep.declare(() =>
    pep.seq(big_thing, " is ", state_of_being));


////////////////////////////////////////////////////////////////////////////////
// Artist sentences
const sent_about_citable_and_dualism = (artist, dualism) =>
    pep.seq(
        make_cite(artist), " is about ", dualism, " where ", make_cite(artist),
	    " is about ", opposite(dualism));

const sentence_about_citable_artist = (artist) =>
    pep.choice(
        ["the ", feature_of, " ", make_cite(artist), " ", is_also_evident_in,
            " ", make_cite(artist), adverb_postjustify, ". "],
        
	    ["in ", make_cite(artist), ", ", artist, " ", says_something, "; in ",
	        make_cite(artist), however, " ", artist, " ", 
	        says_something_else(artist), ". "],
	    
	    [justifier, "the works of ", artist, " are ",
	        works_state_of_being, ". "]);

const something_about_works = pep.declare(() =>
    pep.choice(
        " the use of narrative in",
        " the gender roles in",
        " the semiotics of"));

const works_state_of_being = pep.declare(() =>
    pep.choice(
        "postmodern",
        "not postmodern",
        "modernistic",
        ["an example of ", informal_adj, " ", ideology],
        ["reminiscent of ", artist],
        "empowering"));

const says_something = pep.declare(() =>
    pep.seq(
        makes_statement_about,
        " ",
        term));

const says_something_else = (artist) => says_something;

const makes_statement_about = pep.declare(() =>
    pep.choice(
        "affirms",
        "denies",
        "reiterates",
        "deconstructs",
        "examines",
        "analyses"));

const feature_of = pep.declare(() =>
    pep.choice(
        [dualism_desc, " distinction ", in_term],
        ["example of ", term, " ", in_term],
        [something_of, " of ", term, " ", in_term]));

const is_also_evident_in = pep.declare(() =>
    pep.choice(
        "emerges again in",
        "is also evident in"));

const in_term = pep.declare(() =>
    pep.choice(
        "prevalent in",
        "intrinsic to",
        "depicted in",
        "which is a central theme of"));

const adverb_postjustify = pep.declare(() =>
    pep.opt([", although in a more ", informal_adj, " sense"]));

const work = pep.declare(() =>
    pep.choice(
        [pep_vars.setFrom('foo', generic_surname), "'s",
            footnote_cite(pep.get('foo')), work_about, " ", term],
        ["the works of ", pep_vars.store('vCitable', citable_artist)]));

////////////////////////////////////////////////////////////////////////////////
// Sentences about a concept

const accept_or_reject = pep.choice("accept", "reject");

const p_abst_altern = (conc) =>
    pep.choice(
        p_abst_altern2(conc),
        [p_abst_altern(conc), " and consequently ", accept_or_reject,
            " that ", result]);

const p_abst_altern2 = (conc) =>
    pep.seq(
        accept_or_reject, " ", idea_source, "'s ", work_about,
        " ", conc);

const p_sentence_about_concept = (conc) =>
    pep.seq(
        "the ", role, " has a choice: either ", p_abst_altern(conc),
        " or, alternatively, ", p_abst_altern(conc), ". ");
        
////////////////////////////////////////////////////////////////////////////////
// Descriptions of abstract things, like theories and discourses

const abst_description = pep.declare(() =>
    pep.seq(
        " concerning ",
        term_or_concept_desc));

const abst_desc_plural = pep.declare(() =>
    pep.choice(
        abst_description,
        " that includes "));

const term_or_concept_desc = pep.declare(() =>
    pep.choice(
        term,
        concept_desc));

const plural_numeric_adj = pep.declare(() =>
    pep.choice(
        "any number of",
        "a number of",
        "many",
        "an abundance of",
        "several"));

const exist = pep.declare(() =>
    pep.choice(
        "exist",
        ["may be ", found]));

const found = pep.choice(
    "found",
    "discovered",
    "revealed");

const promotes = pep.choice(
    "promotes",
    "suggests");

const imper_vp = pep.declare(() =>
    pep.choice(
        [imper_neg_verb, " ", bogeyman],
        [imper_verb, " ", big_thing]));

const imper_neg_verb = pep.choice(
    "attack",
    "challenge",
    "deconstruct");

const imper_verb = pep.declare(() =>
    pep.choice(
        imper_verb2,
        [imper_verb2, " and ", imper_verb2]));

const imper_verb2 = pep.declare(() =>
    pep.choice(
        imper_neg_verb,
        "analyse",
        "read",
        "modify"));

const main = pep.choice("main", "primary", "characteristic");

const main_theme_of = pep.choice(
    [main, " theme of "],
    "theme characterizing");
    
////////////////////////////////////////////////////////////////////////////////
// Justify a point.

const justifier = pep.declare(() =>
    pep.choice(
        [pep_vars.setFrom('justName', generic_surname),
            footnote_cite(pep.get('justName')), implies_that],
        ["if ", term, " holds, "]));
        
////////////////////////////////////////////////////////////////////////////////
// Description of a concept

const concept_desc = pep.declare(() =>
    pep.choice(
        ["the ", something_of, " of ", adj, " ", big_thing],
        ["the ", something_between, " between ", big_thing, " and ", big_thing],
        p1_concept_desc(abst_noun),
        ["the role of the ", role, " as ", role],
        ["a ", informal_adj, " ", big_singular_thing]));
        
const p1_concept_desc = (thing) =>
    pep.choice(
        ["not", in_fact, " ", thing, ", but ", modifier_prefix, thing],
        ["not ", thing, per_se, ", but ", modifier_prefix, thing]);

////////////////////////////////////////////////////////////////////////////////
// Smalltalk
const in_fact = pep.opt(", in fact, ");

const per_se = pep.declare(() =>
    pep.choice(
        " as such",
        " per se",
        [", as ", intellectual, " would have it"],
        [", as ", term, " suggests"],
        pep.empty));

////////////////////////////////////////////////////////////////////////////////
// Something
const modifier_prefix = pep.choice("post", "neo", "sub", "pre");

const something_between = pep.choice("difference", "bridge", "common ground");

const thus = pep.choice("thus", "hence", "therefore");

const something_of = pep.declare(() =>
    pep.choice(
        something_of_2,
        [something_of_2, ", and subsequent ", something_of_2, ","],
        [something_of_2, ", and ", thus, " the ", something_of_2, ","],
        [something_of_2, ", and eventually the ", something_of_2, ","],
        [something_of_2, ", and some would say the ", something_of_2, ","]));

const something_of_2 = pep.choice(
    "failure",
    "futility",
    "collapse",
    "fatal flaw",
    "rubicon",
    "stasis",
    "meaninglessness",
    "absurdity",
    "paradigm",
    "genre",
    "defining characteristic",
    "dialectic",
    "economy");

const preamble = pep.choice(
    "however, ",
    "it could be said that ",
    "thus, ",
    "therefore, ",
    "in a sense, ",
    "but ");

const however = pep.choice(
    " ",
    ", however, ",
    ", although, ");

////////////////////////////////////////////////////////////////////////////////
// Result
const result = pep.declare(() =>
    pep.seq(result_2, pep.opt(postcondition)));

const result_2 = pep.declare(() =>
    pep.choice(
        [big_abst_thing, is_used_to, ends],
        [big_nebulous_thing, comes_from, source],
        [big_thing, optional_adv, " has ", property],
        [big_abst_or_institution, " is ", state_of_being],
        ["the ", purpose_word, " of the ", role, " is ", goal],
        [big_abst_or_institution, " is capable of ", capability]));

const result1 = pep.declare(() =>
    pep.choice(
        result,
        ["we can assume that ", result],
        [intellectual, "'s model of ", term, ' is one of "', new_term,
            '", and ', thus, " ", state_of_being]));

const assumption = pep.declare(() =>
    pep.choice(
        term,
	    [intellectual, "'s ", work_about, " ", term],
	    ["the premise of ", term]));

const relation = pep.choice(
    " is equal to ",
    " is distinct from ",
    " is interchangeable with ");

const value_adj = pep.choice("valid", "invalid");

const prim_condition = pep.declare(() =>
    pep.choice(
        [assumption, " is ", value_adj],
        [big_abst_thing, relation, big_abst_thing]));
    
const corollary = pep.choice(
    ["; if that is not the case, ", result1],
	["; otherwise, ", result1],
	pep.empty);

const postcondition = pep.declare(() =>
    pep.choice(
        [", given that ", prim_condition],
        [", but only if ", prim_condition, corollary],
        pep.empty));

////////////////////////////////////////////////////////////////////////////////
// 
const abst_adverb = pep.choice("fundamentally", "intrinsically");

const state_of_being = pep.declare(() =>
    pep.choice(
        state_of_being_2,
        [abst_adverb, " ", state_of_being_2],
        ["part of the ", something_of_2, " of ", big_abst_thing]));

const state_of_being_2 = pep.declare(() =>
    pep.choice(
        "impossible",
        "meaningless",
        "unattainable",
        "elitist",
        ["responsible for ", bogeyman],
        ["used in the service of ", bogeyman],
        "a legal fiction",
        "dead"));

const property = pep.choice(
    "intrinsic meaning",
    "significance",
    "objective value");

const ends = pep.declare(() =>
    pep.choice(
        [neg_verb, " ", victim],
        [pos_neg_verb, " ", bogeyman]));

const implies_that = pep.choice(
    "implies that ",
    "states that ",
    "holds that ",
    "suggests that ");

const is_used_to = pep.choice(
    " is used to ",
    " serves to ",
    " may be used to ");

const comes_from = pep.choice(
    " comes from ",
    " must come from ",
    " is a product of ",
    " is created by ");

const source = pep.choice(
    "communication",
    "the collective unconscious",
    "the masses");

// either give a new term or rehash the old term

const term = pep.declare(() =>
    pep.choice(
        new_term,
        pep_vars.store('v_subject', new_term),
        pep_vars.store('v_subject2', new_term),
        pep_vars.store('v_subject2', new_term)));

const new_term = pep.declare(() =>
    pep.choice(
        p_intell_term(intellectual),
        [adj, " ", abst_noun],
        [adj, " ", abst_noun],
        [adj, " ", adj," theory"],
        ["the ", adj, " paradigm of ", big_nebulous_thing],
        [adj, " ", ideology]));

const p_intell_term = (i) =>
    pep.chain(i, x => pep.seq("ist ", make_concepts(x)));

const ideology = pep.choice(
    "capitalism",
    "Marxism",
    "socialism",
    "feminism",
    "libertarianism",
    "objectivism",
    "rationalism",
    "nationalism",
    "nihilism");

const art_movement = pep.choice(
    "surrealism",
    "modernism",
    "realism",
    "social realism",
    "socialist realism",
    "constructivism",
    "expressionism");

////////////////////////////////////////////////////////////////////////////////
// Adjective
const self_adj = pep.choice(
    "referential",
    "sufficient",
    "justifying",
    "supporting",
    "falsifying",
    "fulfilling");

const informal_adj = pep.declare(() =>
    pep.choice(
        adj,
        ["self-", self_adj],
        "mythopoetical"));

const adj = pep.declare(() =>
    pep.choice(
        adj2,
        [modifier_prefix, adj2]));

const adj2 = pep.declare(() =>
    pep.choice(
        "capitalist",
        adj3,
        [trim_e(adj3), "ist"],
        "cultural",
        "dialectic",
        "textual"));

const adj3 = pep.choice(
    "structural",
    "semiotic",
    "modern",
    "constructive",
    "semantic",
    "deconstructive",
    "patriarchial",
    "conceptual",
    "material");

const optional_adv = pep.declare(() =>
    pep.opt([", ", adv, ","]));

const adv = pep.declare(() =>
    pep.choice(
        adv_2,
        ["perhaps ", adv_2],
        ["somewhat ", adv_2]));

const adv_2 = pep.declare(() =>
    pep.choice(
        "paradoxically",
        "surprisingly",
        "ironically"));

const abst_noun = pep.declare(() =>
    pep.choice(
        abst_noun2,
        "theory",
        "discourse",
        "narrative",
        ["de", abst_noun2]));

const abst_noun2 = pep.declare(() =>
    pep.choice(
        "sublimation",
        [trim_e(adj3), "ism"],
        "construction",
        "appropriation",
        "materialism",
        "situationism"));

const neg_verb = pep.choice("marginalize", "exploit", "oppress", "disempower");

const pos_verb = pep.choice("empower");

const neut_verb = pep.choice("interpolate", "contextualise");

const pos_neg_verb = pep.choice("reinforce", "entrench");

const victim = pep.choice(
    "minorities",
    "the Other",
    "the underprivileged",
    "the proletariat");

const bogeyman = pep.declare(() =>
    pep.choice(
        "capitalism",
        "hierarchy",
        "the status quo",
        "class divisions",
        "sexism",
        [neg_adj, " perceptions of ", big_thing]));

const neg_adj = pep.declare(() =>
    pep.choice(
        neg_adj1,
        neg_adj2,
        [neg_adj1, ", ", neg_adj2]));

const neg_adj1 = pep.choice("outdated", "outmoded", "archaic");

const neg_adj2 = pep.choice("sexist", "colonialist", "elitist");

const work_about = pep.choice(
    "critique of",
    "essay on",
    "analysis of",
    "model of");
    
////////////////////////////////////////////////////////////////////////////////
// Things
const big_thing = pep.declare(() =>
    pep.choice(
        "society",
        "class",
        big_abst_thing,
        "sexual identity"));

const big_abst_thing = pep.choice(
        "culture",
        "language",
        "art",
        "reality",
        "truth",
        "sexuality",
        "narrativity",
        "consciousness");

const institution = pep.choice(
    "the Constitution",
    "the media",
    "academe",
    "the law",
    "government",
    "the State",
    "the collective",
    "the establishment");

const big_abst_or_institution = pep.declare(() =>
    pep.choice(
        big_abst_thing,
        institution));

const big_nebulous_thing = pep.choice(
    "reality", "discourse", "concensus", "expression", "narrative", "context"); 

const big_singular_thing = pep.choice(
    "reality", "whole", "paradox", "totality");

const abst_concept = pep.choice("domination", "difference");

const purpose_word = pep.choice(
    "purpose", "goal", "raison d'etre", "task", "significance");

const role = pep.choice(
    "artist", "observer", "participant", "reader", "poet", "writer");

const goal = pep.choice(
    "significant form",
    "deconstruction",
    "social comment");

const capability = pep.declare(() =>
    pep.choice(
        goal,
        intent_variant,
        "truth",
        "significance"));

const intent_variant = pep.choice( "intent", "intention", "intentionality");

const dualisable_word = pep.choice(
    "opening",
    "closing",
    "figure",
    "ground",
    "within",
    "without",
    "creation",
    "destruction",
    "masculine",
    "feminine");

const opposite = pep_trans.dicti({
	"opening" : "closing",
	"closing" : "opening",
	"figure" : "ground",
	"ground" : "figure",
	"within" : "without",
	"without" : "within",
	"creation" : "destruction",
	"destruction" : "creation",
	"masculine" : "feminine",
	"feminine" : "masculine",
});

const i_dualism_desc = (word) =>
    pep.seq(word, "/", opposite(word));

const dualism_desc = pep.declare(() =>
    i_dualism_desc(dualisable_word));

////////////////////////////////////////////////////////////////////////////////
// Names
const intellectual = pep.choice(
    "Lacan",
    "Derrida",
    "Baudrillard",
    "Sartre",
    "Foucault",
    "Marx",
    "Debord",
    "Bataille",
    "Lyotard",
    "Sontag");

const author = pep.choice(
    "Lodge",
    "Huyssen",
    "Cooke",
    "Owens",
    "Johnston",
    "Olsen",
    "Giddens",
    "Milner");

const name = pep.declare(() =>
    pep.choice(
        [first_name, " ", generic_surname],
        [first_name, " ", initial, generic_surname],
        [first_name, " ", initial, initial, generic_surname],
        [initial, first_name, " ", generic_surname]));

const jean_suffix = pep.choice(
    "Michel",
    "Luc",
    "Jacques",
    "Jean",
    "Francois");

const first_name = pep.choice(
    ["Jean-", jean_suffix],
    jean_suffix,
    "Andreas",
    "Hans",
    "Rudolf",
    "Wilhelm",
    "Stefan",
    "Helmut",
    "Ludwig",
    "David",
    "John",
    "Linda",
    "Charles",
    "Thomas",
    "Barbara",
    "Jane",
    "Stephen",
    "Henry",
    "Agnes",
    "Anna",
    "Paul",
    "Catherine",
    "Martin");

const generic_surname = pep.declare(() =>
    pep.choice(
        // random intellectuals ;-)
        "de Selby", "Hanfkopf", "la Fournier", "la Tournier", "Hamburger",
        // Lovecraftean scholars
        "von Junz" , "d'Erlette" , "Geoffrey" , "Prinn",
        // people from g09, monash.test or the AlphaLab
        "Bailey" , "Brophy" , "Cameron" , "Humphrey" , "Pickett",
        "Reicher" , "Sargeant" , "Scuglia" , "Werther" , "Wilson",
        // net.crackpots
        "McElwaine" , "Abian" , "von Ludwig", // Plutonium's real name
        "Parry" , "Drucker" , "Dahmus" , "Dietrich", // a Monash local
        "Hubbard", 
        // People from flat-earth, particularly those who helped with the Dada Engine
        "Porter" , "Buxton" , "Long" , "Tilton" , "Finnis"));

const initial = pep.seq(pep.choicea("ABCDEFGHIJKLMNOPQRSTUVWXYZ"), '. ');

const initials = pep.choice(
    initial,
    [initial, initial],
    [initial, initial, initial]);

const year = pep.declare(() =>
    pep.seq("19", decade_digit, digit));

const decade_digit = pep.choicea("78")

const digit = pep.choicea("0123456789")

////////////////////////////////////////////////////////////////////////////////
// Publish
const publisher = pep.declare(() =>
    pep.choice(
        ["University of ", university_of, " Press"],
        ["University of ", university_of, " Press"],
        [something_university, " University Press"],
        [something_university, " University Press"],
        "O'Reilly & Associates",
        "And/Or Press",
        "Loompanics",
        "Panic Button Books",
        "Schlangekraft"));

const footnote_cite_text = (surname) =>
    pep.seq(
        surname, ', ', initials, pep.opt('ed. '), '(', year, ') ',
        md.italic(pep.seq(title, '.')), " ", publisher);

const footnote_cite = (surname) =>
    /*FOOTNOTE*/footnote_cite_text(surname);


const idea_source = pep.declare(() =>
    pep.choice(
        intellectual,
        author,
        hist_intel));

const hist_intel = pep.choice(
    "Plato",
    "Voltaire",
    "Nietzsche",
    "Kant",
    "Hegel",
    "Hume");
    
////////////////////////////////////////////////////////////////////////////////
// Artists
const citable_artist = pep.choice(
    "Burroughs",
    "Joyce",
    "Gibson",
    "Stone",
    "Pynchon",
    "Spelling",
    "Tarantino",
    "Madonna",
    "Rushdie",
    "Eco");

const uncitable_artist = pep.choice(
    "Koons",
    "Mapplethorpe",
    "Glass",
    "Lynch",
    "Fellini",
    "Cage",
    "McLaren");

const artist = pep.choice(
    citable_artist,
    uncitable_artist);

const artist_gender_pronoun = pep_trans.dicti({
	"Burroughs": "he",
	"Joyce": "he",
	"Gibson": "he",
	"Stone": "he",
	"Pynchon": "he",
	"Spelling": "he",
	"Tarantino": "he",
	"Madonna": "she",
});

const possessivify_pronoun = pep_trans.dict({
	"he": "his",
	"she": "her",
	"it": "its",
	"SHe": "hir",
});


////////////////////////////////////////////////////////////////////////////////
// Works and Concepts
const make_cite = (g) => pep.chain(g, x => works[x]);

const works = {
    'Spelling': pep.choice(
        "Beverly Hills 90210",
        "Melrose Place",
        "Models, Inc."),
    
    'Pynchon': pep.choice(
        "Gravity's Rainbow",
        "Vineland",
        "The Crying of Lot 49"),
    
    'Stone': pep.choice(
        "JFK",
        "Natural Born Killers",
        "Heaven and Earth",
        "Platoon"),

    'Tarantino': pep.choice(
        "Reservoir Dogs",
        "Pulp Fiction",
        "Clerks"),
    
    'Fellini': pep.choice(
        "8 1/2"),
        
    'Burroughs': pep.choice(
        "The Naked Lunch",
        "The Soft Machine",
        "Queer",
        "Port of Saints",
        "Junky",
        "The Ticket that Exploded",
        "Nova Express",
        "The Last Words of Dutch Schultz"),

    'Joyce': pep.choice(
        "Ulysses",
        "Finnegan's Wake"),
    
    'Gibson': pep.choice(
        "Neuromancer",
        "The Burning Chrome",
        "Mona Lisa Overdrive",
        "Virtual Light"),
        
    'Madonna': pep.choice(
        "Erotica",
        "Sex",
        "Material Girl"),

    'Rushdie': pep.choice(
        "Satanic Verses",
        "Midnight's Children"),

    'Eco': pep.choice(
        "The Name of the Rose",
        "Foucault's Pendulum"),
};

const make_concepts = (g) => pep.chain(g, x => concepts[x]);

const concepts = {
    'Lacan': pep.choice(
        "obscurity"),

    'Derrida': pep.choice(
        "reading"),

    'Baudrillard': pep.choice(
        "simulation",
        "simulacra",
        "hyperreality"),
    
    'Sartre': pep.choice(
        "absurdity",
        "existentialism"),
    
    'Foucault': pep.choice(
        "panopticon",
        "power relations"),
        
    'Marx': pep.choice(
        "capitalism",
        "socialism",
        "class"),
    
    'Debord': pep.choice(
        "image",
        "situation"),

    'Bataille': pep.choice(
        "'powerful communication'"),
        
    'Lyotard': pep.choice(
        "narrative"),
    
    'Sontag': pep.choice(
        "camp"),
};



console.log(output.run());