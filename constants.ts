
import { KnowledgeGraph, HistoricalNode, HistoricalEdge, HistoricalNodeType } from './types';

// Full Endecja Knowledge Base from provided JSON (converted to HistoricalNode/Edge schema)
const ENDECJA_DATA = {
  "metadata": {
    "title": "Baza Wiedzy o Endecji (Narodowej Demokracji)",
    "description": "Kompleksowa baza wiedzy dla edukacyjnej aplikacji demitologizującej propagandę sowiecką o Endecji",
    "version": "1.0",
    "created": "2025-11-23T18:18:22.108291",
    "sources_count": 26,
    "nodes_count": 67,
    "edges_count": 110,
    "myths_count": 7,
    "timeline_count": 33,
    "updated": "2025-11-23",
    "language": "polski",
    "encoding": "UTF-8"
  },
  "nodes": [
    {
      "id": "dmowski_roman",
      "label": "Roman Dmowski",
      "type": "person",
      "dates": "1864-1939",
      "birth_date": "1864",
      "death_date": "1939-01-02",
      "description": "Założyciel i główny ideolog Endecji. Twórca Ligi Narodowej (1893), przywódca Komitetu Narodowego Polskiego na konferencji pokojowej w Paryżu (1919). Sygnatariusz Traktatu Wersalskiego. Autor 'Myśli nowoczesnego Polaka' (1903) i koncepcji piastowskiej. Propagował egoizm narodowy jako filozofię polityczną. Zmarł 2 stycznia 1939, 8 miesięcy przed wybuchem II wojny światowej.",
      "roles": [
        "ideolog",
        "polityk",
        "dyplomata",
        "pisarz"
      ],
      "key_concepts": [
        "egoizm narodowy",
        "koncepcja piastowska",
        "polityka wschodnia"
      ],
      "myth_related": true,
      "importance": 1.0,
      "sources": [
        {
          "title": "Myśli nowoczesnego Polaka",
          "author": "Roman Dmowski",
          "year": 1903
        },
        {
          "title": "Niemcy, Rosja i kwestia polska",
          "author": "Roman Dmowski",
          "year": 1908
        },
        {
          "title": "Polityka polska i odbudowanie państwa",
          "author": "Roman Dmowski",
          "year": 1925
        },
        {
          "title": "Kościół, Naród i Państwo",
          "author": "Roman Dmowski",
          "year": 1927
        },
        {
          "title": "When Nationalism Began to Hate",
          "author": "Brian Porter",
          "year": 2000
        }
      ]
    },
    {
      "id": "poplawski_jan",
      "label": "Jan Ludwik Popławski",
      "type": "person",
      "dates": "1854-1908",
      "birth_date": "1854",
      "death_date": "1908-03-12",
      "description": "Współzałożyciel Ligi Narodowej i główny teoretyk polskiego nacjonalizmu. Redaktor 'Przeglądu Wszechpolskiego'. W 1886 współtworzył tygodnik 'Głos'. W 1893 przekształcił Ligę Polską w Ligę Narodową wraz z Dmowskim i Balickim. Redagował miesięcznik 'Polak' dla chłopów, przyczyniając się do podniesienia świadomości narodowej wśród ludu. Zmarł 12 marca 1908 w Warszawie na raka gardła.",
      "roles": [
        "teoretyk",
        "publicysta",
        "redaktor",
        "działacz"
      ],
      "key_concepts": [
        "świadomość narodowa",
        "ruch narodowy",
        "demokratyzacja"
      ],
      "importance": 0.9,
      "sources": [
        {
          "title": "Pisma polityczne",
          "author": "Jan Ludwik Popławski",
          "year": 1908
        },
        {
          "title": "Co to jest naród?",
          "author": "Jan Ludwik Popławski",
          "year": 1904
        },
        {
          "title": "Narodowa Demokracja 1893-1939",
          "author": "Roman Wapiński",
          "year": 1980
        }
      ]
    },
    {
      "id": "balicki_zygmunt",
      "label": "Zygmunt Balicki",
      "type": "person",
      "dates": "1858-1916",
      "birth_date": "1858",
      "death_date": "1916-09-12",
      "description": "Ideolog egoizmu narodowego i współzałożyciel Ligi Narodowej. Autor 'Egoizmu narodowego wobec etyki' (1902), w którym zdefiniował nacjonalizm jako racjonalne dążenie do interesu narodowego. W 1887 założył Związek Młodzieży Polskiej 'Zet'. Socjolog i publicysta 'Przeglądu Wszechpolskiego'. Zmarł 12 września 1916 w Piotrogrodzie.",
      "roles": [
        "ideolog",
        "socjolog",
        "publicysta"
      ],
      "key_concepts": [
        "egoizm narodowy",
        "teoria nacjonalizmu",
        "darwinizm społeczny"
      ],
      "importance": 0.85,
      "sources": [
        {
          "title": "Egoizm narodowy wobec etyki",
          "author": "Zygmunt Balicki",
          "year": 1902
        },
        {
          "title": "Psychologia społeczna",
          "author": "Zygmunt Balicki"
        },
        {
          "title": "Zasady wychowania narodowego",
          "author": "Zygmunt Balicki"
        }
      ]
    },
    {
      "id": "grabski_wladyslaw",
      "label": "Władysław Grabski",
      "type": "person",
      "dates": "1874-1938",
      "birth_date": "1874",
      "death_date": "1938",
      "description": "Ekonomista i polityk narodowo-demokratyczny. Premier RP (1923-1925). Twórca reformy walutowej i wprowadzenia złotego polskiego. Członek Stronnictwa Narodowego, skupiony na polityce gospodarczej. Brat Stanisława Grabskiego.",
      "roles": [
        "ekonomista",
        "premier",
        "polityk"
      ],
      "key_concepts": [
        "reforma walutowa",
        "złoty polski",
        "polityka gospodarcza"
      ],
      "importance": 0.75,
      "sources": [
        {
          "title": "Grabski biography",
          "author": "Zbigniew Landau",
          "year": 1985
        }
      ]
    },
    {
      "id": "grabski_stanislaw",
      "label": "Stanisław Grabski",
      "type": "person",
      "dates": "1871-1949",
      "birth_date": "1871",
      "death_date": "1949",
      "description": "Ekonomista, polityk narodowy, brat Władysława Grabskiego. Działacz Stronnictwa Narodowego, profesor ekonomii. Zaangażowany w politykę oświatową i gospodarczą II RP.",
      "roles": [
        "ekonomista",
        "polityk",
        "profesor"
      ],
      "key_concepts": [
        "polityka gospodarcza",
        "szkolnictwo"
      ],
      "importance": 0.7,
      "sources": []
    },
    {
      "id": "mosdorf_jan",
      "label": "Jan Mosdorf",
      "type": "person",
      "dates": "1904-1943",
      "birth_date": "1904",
      "death_date": "1943",
      "description": "Doktor filozofii i działacz narodowy młodego pokolenia. Przywódca Młodzieży Wszechpolskiej, autor broszury 'Akademik i polityka'. Działacz Obozu Wielkiej Polski. Przedstawiciel radykalnego skrzydła ruchu narodowego. Zginął w 1943 roku.",
      "roles": [
        "działacz młodzieżowy",
        "publicysta",
        "filozof"
      ],
      "key_concepts": [
        "Młodzież Wszechpolska",
        "radykalizm narodowy",
        "polityka akademicka"
      ],
      "importance": 0.65,
      "sources": [
        {
          "title": "Akademik i polityka",
          "author": "Jan Mosdorf",
          "year": 1929
        },
        {
          "title": "Wczoraj i jutro",
          "author": "Jan Mosdorf"
        }
      ]
    },
    {
      "id": "rybarski_roman",
      "label": "Roman Rybarski",
      "type": "person",
      "dates": "1887-1942",
      "birth_date": "1887",
      "death_date": "1942",
      "description": "Ekonomista, prawnik i działacz narodowy. Profesor Uniwersytetu Warszawskiego. Poseł na Sejm i przewodniczący klubu parlamentarnego Stronnictwa Narodowego (1928-1935). Autor 'Siły i prawa'. Działacz podziemia w czasie II wojny światowej. Zginął w Auschwitz w 1942 roku.",
      "roles": [
        "ekonomista",
        "prawnik",
        "poseł",
        "profesor"
      ],
      "key_concepts": [
        "teoria prawa",
        "ekonomia narodowa",
        "siła i prawo"
      ],
      "importance": 0.7,
      "sources": [
        {
          "title": "Siła i prawo",
          "author": "Roman Rybarski",
          "year": 1936
        },
        {
          "title": "Naród, jednostka i klasa",
          "author": "Roman Rybarski"
        }
      ]
    },
    {
      "id": "pilsudski_jozef",
      "label": "Józef Piłsudski",
      "type": "person",
      "dates": "1867-1935",
      "birth_date": "1867",
      "death_date": "1935",
      "description": "RYWAL Dmowskiego. Przywódca obozu sanacyjnego po zamachu majowym 1926. Propagował federalizm (koncepcja Międzymorza) w przeciwieństwie do etnicznego nacjonalizmu Dmowskiego. Marszałek Polski, twórca Legionów Polskich.",
      "roles": [
        "marszałek",
        "polityk",
        "wojskowy"
      ],
      "key_concepts": [
        "sanacja",
        "federalizm",
        "Międzymorze",
        "Legiony"
      ],
      "rival": true,
      "importance": 0.95,
      "sources": [
        {
          "title": "Józef Piłsudski 1867-1935",
          "author": "Andrzej Garlicki",
          "year": 1988
        }
      ]
    },
    {
      "id": "wasilewski_leon",
      "label": "Leon Wasilewski",
      "type": "person",
      "dates": "1870-1936",
      "birth_date": "1870",
      "death_date": "1936",
      "description": "Polityk i publicysta narodowy, działacz Ligi Narodowej. Współpracownik Dmowskiego i Popławskiego. Specjalista od spraw narodowościowych i kwestii wschodnich.",
      "roles": [
        "polityk",
        "publicysta",
        "ekspert"
      ],
      "key_concepts": [
        "polityka wschodnia",
        "sprawy narodowościowe"
      ],
      "importance": 0.6,
      "sources": []
    },
    {
      "id": "glabisz_stanislaw",
      "label": "Stanisław Głąbiński",
      "type": "person",
      "dates": "1862-1943",
      "birth_date": "1862",
      "death_date": "1943",
      "description": "Polityk narodowo-demokratyczny, profesor prawa. Działacz galicyjski Stronnictwa Narodowo-Demokratycznego.",
      "roles": [
        "polityk",
        "prawnik",
        "profesor"
      ],
      "importance": 0.5,
      "sources": []
    },
    {
      "id": "nowaczynski_adolf",
      "label": "Adolf Nowaczyński",
      "type": "person",
      "dates": "1876-1944",
      "birth_date": "1876",
      "death_date": "1944",
      "description": "Pisarz, dramaturg i publicysta narodowy. Współpracownik prasy narodowej.",
      "roles": [
        "pisarz",
        "dramaturg",
        "publicysta"
      ],
      "importance": 0.55,
      "sources": []
    },
    {
      "id": "debicki_ludwik",
      "label": "Ludwik Dębicki",
      "type": "person",
      "dates": "1845-1908",
      "birth_date": "1845",
      "death_date": "1908",
      "description": "Historyk i publicysta, współpracownik ruchu narodowego.",
      "roles": [
        "historyk",
        "publicysta"
      ],
      "importance": 0.45,
      "sources": []
    },
    {
      "id": "liga_narodowa",
      "label": "Liga Narodowa",
      "type": "org",
      "dates": "1893-1928",
      "founding_date": "1893",
      "dissolution_date": "1928",
      "description": "Tajna organizacja założona przez Dmowskiego, Popławskiego i Balickiego. Pierwsza nowoczesna polska organizacja nacjonalistyczna. Przekształciła Ligę Polską (1887) w organizację o charakterze politycznym. Ewoluowała w partię polityczną.",
      "founders": [
        "dmowski_roman",
        "poplawski_jan",
        "balicki_zygmunt"
      ],
      "character": "tajna organizacja",
      "importance": 1.0,
      "sources": [
        {
          "title": "Statut Ligi Narodowej",
          "year": 1893,
          "archive": "Archiwum Akt Nowych"
        }
      ]
    },
    {
      "id": "snd",
      "label": "Stronnictwo Narodowo-Demokratyczne",
      "type": "org",
      "dates": "1897-1919",
      "founding_date": "1897",
      "dissolution_date": "1919",
      "description": "Partia Narodowo-Demokratyczna. Jawne skrzydło polityczne Ligi Narodowej. Uczestniczyło w Dumie Rosyjskiej (1906-1917). Przekształciło się później w Stronnictwo Narodowe.",
      "character": "partia polityczna",
      "importance": 0.9,
      "sources": [
        {
          "title": "Narodowa Demokracja",
          "author": "Roman Wapiński",
          "year": 1980
        }
      ]
    },
    {
      "id": "komitet_narodowy",
      "label": "Komitet Narodowy Polski",
      "type": "org",
      "dates": "1917-1919",
      "founding_date": "1917",
      "dissolution_date": "1919",
      "description": "Prowadzony przez Dmowskiego. Uznany przez aliantów jako oficjalna reprezentacja polska podczas I wojny światowej. Zabezpieczył granice Polski w Wersalu.",
      "leader": "dmowski_roman",
      "character": "organizacja emigracyjna",
      "myth_related": true,
      "importance": 0.95,
      "sources": [
        {
          "title": "Allied recognition decree",
          "year": 1917,
          "archive": "British Foreign Office"
        }
      ]
    },
    {
      "id": "stronnictwo_narodowe",
      "label": "Stronnictwo Narodowe",
      "type": "org",
      "dates": "1928-1939",
      "founding_date": "1928",
      "dissolution_date": "1939",
      "description": "Partia Narodowa. Zreformowana po zamachu majowym Piłsudskiego. Opozycja wobec reżimu sanacyjnego. Podział między starszym pokoleniem (Dmowski) a radykalną młodzieżą (ONR).",
      "character": "partia polityczna",
      "importance": 0.85,
      "sources": [
        {
          "title": "Program Stronnictwa Narodowego",
          "year": 1928
        }
      ]
    },
    {
      "id": "owp",
      "label": "Obóz Wielkiej Polski",
      "type": "org",
      "dates": "1926-1933",
      "founding_date": "1926-12",
      "dissolution_date": "1933",
      "description": "Organizacja założona przez Romana Dmowskiego w grudniu 1926 roku. Miała charakter masowego ruchu narodowego, łączącego różne warstwy społeczne. Rozwiązana przez władze sanacyjne w 1933.",
      "founder": "dmowski_roman",
      "character": "ruch narodowy",
      "importance": 0.8,
      "sources": []
    },
    {
      "id": "mlodziez_wszechpolska",
      "label": "Młodzież Wszechpolska",
      "type": "org",
      "dates": "1922-1939",
      "founding_date": "1922",
      "description": "Organizacja młodzieżowa ruchu narodowego na uniwersytetach. Początkowo 'Narodowe Zjednoczenie Młodzieży' (1919), przemianowana w 1922. Organ Obozu Wielkiej Polski na wyższych uczelniach. Prowadziła walkę z komunistami, żydami i Ukraińcami. Kierowała polityką akademicką i Naczelnym Komitetem Akademickim.",
      "character": "organizacja młodzieżowa",
      "importance": 0.75,
      "sources": [
        {
          "title": "Akademik i polityka",
          "author": "Jan Mosdorf",
          "year": 1929
        }
      ]
    },
    {
      "id": "onr",
      "label": "Obóz Narodowo-Radykalny",
      "type": "org",
      "dates": "1934-1939",
      "founding_date": "1934",
      "description": "Radykalna organizacja narodowa, odłam młodych działaczy niezadowolonych z umiarkowanej polityki starszego pokolenia Stronnictwa Narodowego. Odłączenie się młodych radykałów.",
      "character": "organizacja radykalna",
      "importance": 0.65,
      "sources": []
    },
    {
      "id": "zalozenie_ligi",
      "label": "Założenie Ligi Narodowej",
      "type": "event",
      "dates": "1893",
      "date": "1893",
      "description": "Tajne spotkanie w Warszawie. Dmowski, Popławski i Balicki założyli pierwszą nowoczesną polską organizację nacjonalistyczną. Przekształcenie Ligi Polskiej w Ligę Narodową.",
      "importance": 1.0,
      "sources": [
        {
          "title": "Liga Narodowa founding documents",
          "archive": "AAN",
          "year": 1893
        }
      ]
    },
    {
      "id": "udzial_w_dumie",
      "label": "Udział w Dumie Rosyjskiej",
      "type": "event",
      "dates": "1906-1917",
      "start_date": "1906",
      "end_date": "1917",
      "description": "Członkowie ND wybrani do Dumy Rosyjskiej. Dmowski i inni zabiegali o autonomię polską w ramach rosyjskich. Polityka ugodowa z Rosją wobec zagrożenia niemieckiego.",
      "myth_related": true,
      "importance": 0.8,
      "sources": [
        {
          "title": "Dmowski Duma speeches",
          "archive": "Russian State Archive",
          "years": "1906-1909"
        }
      ]
    },
    {
      "id": "konferencja_paryska",
      "label": "Konferencja Pokojowa w Paryżu",
      "type": "event",
      "dates": "1919",
      "date": "1919",
      "description": "Dmowski reprezentował Polskę. Zabezpieczył zachodnie granice w Traktacie Wersalskim. Piłsudski prowadził kampanie militarne na wschodzie. Podpisanie Traktatu Wersalskiego przez Dmowskiego i Paderewskiego.",
      "myth_related": true,
      "importance": 1.0,
      "sources": [
        {
          "title": "Treaty of Versailles - Polish provisions",
          "year": 1919
        }
      ]
    },
    {
      "id": "zamach_majowy",
      "label": "Zamach Majowy",
      "type": "event",
      "dates": "1926-05",
      "date": "1926-05",
      "description": "Piłsudski przejął władzę. ND sprzeciwiło się zamachowi i późniejszemu autorytarnemu reżimowi sanacji. Oznaczało definitywny rozłam.",
      "importance": 0.9,
      "sources": [
        {
          "title": "Przewrót majowy 1926",
          "author": "Andrzej Garlicki",
          "year": 1979
        }
      ]
    },
    {
      "id": "smierc_dmowskiego",
      "label": "Śmierć Dmowskiego",
      "type": "event",
      "dates": "1939-01-02",
      "date": "1939-01-02",
      "description": "Dmowski zmarł w Warszawie 2 stycznia 1939, 8 miesięcy przed wybuchem II wojny światowej. Nigdy nie był świadkiem inwazji nazistowskiej ani Holokaustu.",
      "myth_related": true,
      "importance": 0.85,
      "sources": [
        {
          "title": "Death certificate",
          "location": "Warsaw Registry Office",
          "date": "1939-01-02"
        }
      ]
    },
    {
      "id": "rewolucja_1905",
      "label": "Rewolucja 1905 roku",
      "type": "event",
      "dates": "1905",
      "date": "1905",
      "description": "Dmowski i narodowcy sprzeciwili się rewolucji, uznając ją za niebezpieczną dla sprawy polskiej. Przeciwstawienie się lewicy i socjalistom.",
      "importance": 0.7,
      "sources": []
    },
    {
      "id": "powstanie_sn",
      "label": "Powstanie Stronnictwa Narodowego",
      "type": "event",
      "dates": "1928",
      "date": "1928",
      "description": "Reorganizacja ruchu narodowego po zamachu majowym. Założenie Stronnictwa Narodowego jako następcy SND.",
      "importance": 0.75,
      "sources": []
    },
    {
      "id": "powstanie_owp",
      "label": "Powstanie Obozu Wielkiej Polski",
      "type": "event",
      "dates": "1926-12",
      "date": "1926-12",
      "description": "Roman Dmowski powołał do życia Obóz Wielkiej Polski jako masowy ruch narodowy. Młodzież Wszechpolska oddała się do jego dyspozycji.",
      "importance": 0.75,
      "sources": []
    },
    {
      "id": "przeglad_wszechpolski",
      "label": "Przegląd Wszechpolski",
      "type": "publication",
      "dates": "1895-1905",
      "start_date": "1895",
      "end_date": "1905",
      "description": "Przegląd Wszechpolski. Główna gazeta ND redagowana przez Popławskiego. Publikowała teorię nacjonalistyczną i komentarze polityczne. Współpracowali Dmowski, Balicki i inni działacze.",
      "editor": "poplawski_jan",
      "importance": 0.8,
      "sources": [
        {
          "title": "Digital archive",
          "url": "https://www.wbc.poznan.pl"
        }
      ]
    },
    {
      "id": "mysli_polaka",
      "label": "Myśli nowoczesnego Polaka",
      "type": "publication",
      "dates": "1903",
      "date": "1903",
      "description": "Dzieło fundamentalne Dmowskiego. 'Myśli nowoczesnego Polaka'. Nakreślił egoizm narodowy i koncepcję piastowską. Manifest polskiego nacjonalizmu. Pisane w 1902, opublikowane w 1903.",
      "author": "dmowski_roman",
      "importance": 1.0,
      "sources": [
        {
          "title": "Myśli nowoczesnego Polaka",
          "author": "Roman Dmowski",
          "year": 1903
        }
      ]
    },
    {
      "id": "egoizm_narodowy",
      "label": "Egoizm narodowy wobec etyki",
      "type": "publication",
      "dates": "1902",
      "date": "1902",
      "description": "Kluczowa broszura Balickiego definiująca filozofię egoizmu narodowego jako racjonalne dążenie do interesu narodowego, pod wpływem darwinizmu społecznego.",
      "author": "balicki_zygmunt",
      "importance": 0.9,
      "sources": [
        {
          "title": "Egoizm narodowy wobec etyki",
          "author": "Zygmunt Balicki",
          "year": 1902
        }
      ]
    },
    {
      "id": "niemcy_rosja",
      "label": "Niemcy, Rosja i kwestia polska",
      "type": "publication",
      "dates": "1908",
      "date": "1908",
      "description": "Dzieło Dmowskiego uzasadniające geopolitycznie orientację prorosyjską wobec zagrożenia niemieckiego.",
      "author": "dmowski_roman",
      "importance": 0.85,
      "sources": []
    },
    {
      "id": "kosciol_narod",
      "label": "Kościół, Naród i Państwo",
      "type": "publication",
      "dates": "1927",
      "date": "1927",
      "description": "Broszura programowa Dmowskiego dla Obozu Wielkiej Polski. Analiza związku katolicyzmu z polską tożsamością narodową.",
      "author": "dmowski_roman",
      "importance": 0.8,
      "sources": []
    },
    {
      "id": "polak",
      "label": "Polak",
      "type": "publication",
      "dates": "1900-1908",
      "description": "Miesięcznik dla chłopów redagowany przez Popławskiego. Kluczowy dla podniesienia świadomości narodowej wśród ludu.",
      "editor": "poplawski_jan",
      "importance": 0.7,
      "sources": []
    },
    {
      "id": "akademik_polityka",
      "label": "Akademik i polityka",
      "type": "publication",
      "dates": "1929",
      "date": "1929",
      "description": "Broszura Jana Mosdorfa o roli młodzieży akademickiej w ruchu narodowym. Program Młodzieży Wszechpolskiej.",
      "author": "mosdorf_jan",
      "importance": 0.65,
      "sources": []
    },
    {
      "id": "sila_prawo",
      "label": "Siła i prawo",
      "type": "publication",
      "dates": "1936",
      "date": "1936",
      "description": "Dzieło Romana Rybarskiego analizujące stosunek siły do prawa w życiu społecznym i politycznym.",
      "author": "rybarski_roman",
      "importance": 0.7,
      "sources": []
    },
    {
      "id": "egoizm_narodowy_concept",
      "label": "Egoizm Narodowy",
      "type": "belief",
      "description": "Podstawowa filozofia ND autorstwa Balickiego. Narody powinny dążyć do racjonalnego interesu własnego, nie romantycznego idealizmu. Pod wpływem darwinizmu społecznego. Narodowy interes jako najwyższa wartość polityczna.",
      "theorist": "balicki_zygmunt",
      "importance": 0.9,
      "sources": [
        {
          "title": "Egoizm narodowy wobec etyki",
          "author": "Zygmunt Balicki",
          "year": 1902
        }
      ]
    },
    {
      "id": "koncepcja_piastowska",
      "label": "Koncepcja Piastowska",
      "type": "belief",
      "description": "Wizja Dmowskiego: Polska powinna być budowana na historycznie polskich ziemiach (dynastia Piastów). Przeciwstawiona federalizmowi Piłsudskiego (Międzymorze). Polska etniczniezwarty organizm państwowy.",
      "theorist": "dmowski_roman",
      "importance": 0.85,
      "sources": [
        {
          "title": "Polityka polska i odbudowanie państwa",
          "author": "Roman Dmowski",
          "year": 1925
        }
      ]
    },
    {
      "id": "swiadomosc_narodowa",
      "label": "Świadomość Narodowa",
      "type": "belief",
      "description": "Kluczowe pojęcie Popławskiego. Naród to wspólnota języka, obyczajów, tradycji, historii i kultury. Świadomość narodowa jako ostateczny czynnik spajający naród.",
      "theorist": "poplawski_jan",
      "importance": 0.8,
      "sources": [
        {
          "title": "Co to jest naród?",
          "author": "Jan Ludwik Popławski",
          "year": 1904
        }
      ]
    },
    {
      "id": "polityka_wschodnia",
      "label": "Polityka Wschodnia",
      "type": "belief",
      "description": "Orientacja ND wobec Rosji i Niemiec. Pragmatyczne podejście: Niemcy jako większe zagrożenie niż Rosja. Współpraca z Rosją przed 1917, później antybolszewizm.",
      "importance": 0.75,
      "sources": []
    },
    {
      "id": "nacjonalizm_katolicki",
      "label": "Nacjonalizm Katolicki",
      "type": "belief",
      "description": "Nierozerwalna więź katolicyzmu z polską tożsamością narodową. Kościół jako filar narodowy. Koncepcja rozwinięta w 'Kościół, Naród i Państwo'.",
      "theorist": "dmowski_roman",
      "importance": 0.8,
      "sources": []
    },
    {
      "id": "paderewski_ignacy",
      "label": "Ignacy Jan Paderewski",
      "type": "person",
      "dates": "1860-1941",
      "description": "Pianista, kompozytor i polityk. Współsygnatariusz Traktatu Wersalskiego wraz z Dmowskim. Premier i minister spraw zagranicznych (1919).",
      "roles": [
        "pianista",
        "premier",
        "dyplomata"
      ],
      "importance": 0.75,
      "sources": []
    },
    {
      "id": "stroński_stanisław",
      "label": "Stanisław Stroński",
      "type": "person",
      "dates": "1882-1955",
      "description": "Publicysta i polityk narodowy. Działacz Stronnictwa Narodowego, redaktor prasy narodowej.",
      "roles": [
        "publicysta",
        "polityk"
      ],
      "importance": 0.55,
      "sources": []
    },
    {
      "id": "romer_eugeniusz",
      "label": "Eugeniusz Romer",
      "type": "person",
      "dates": "1871-1954",
      "description": "Geograf i kartograf. Współpracował z Dmowskim przy ustalaniu granic Polski na konferencji paryskiej.",
      "roles": [
        "geograf",
        "kartograf",
        "ekspert"
      ],
      "importance": 0.6,
      "sources": []
    },
    {
      "id": "seyda_mariano",
      "label": "Marian Seyda",
      "type": "person",
      "dates": "1879-1967",
      "description": "Polityk narodowy z Wielkopolski, minister spraw zagranicznych RP (1923).",
      "roles": [
        "polityk",
        "minister"
      ],
      "importance": 0.65,
      "sources": []
    },
    {
      "id": "giertych_jędrzej",
      "label": "Jędrzej Giertych",
      "type": "person",
      "dates": "1903-1992",
      "description": "Działacz młodego pokolenia narodowego, publicysta. Przywódca ONR.",
      "roles": [
        "działacz",
        "publicysta"
      ],
      "importance": 0.6,
      "sources": []
    },
    {
      "id": "doboszynski_adam",
      "label": "Adam Doboszyński",
      "type": "person",
      "dates": "1904-1949",
      "description": "Polityk, pisarz i publicysta. Członek Stronnictwa Narodowego i Obozu Wielkiej Polski. Teoretyk gospodarki narodowej.",
      "roles": [
        "polityk",
        "pisarz",
        "ekonomista"
      ],
      "importance": 0.6,
      "sources": []
    },
    {
      "id": "rutkowski_jan",
      "label": "Jan Rutkowski",
      "type": "person",
      "dates": "1886-1949",
      "description": "Historyk gospodarczy, współpracownik ruchu narodowego.",
      "roles": [
        "historyk"
      ],
      "importance": 0.45,
      "sources": []
    },
    {
      "id": "demokracja_narodowa",
      "label": "Demokracja Narodowa",
      "type": "belief",
      "description": "Idea szerokiego ruchu narodowego obejmującego wszystkie warstwy społeczne. Przeciwstawienie się podziałom klasowym. Naród jako wartość nadrzędna wobec klas.",
      "importance": 0.8,
      "sources": []
    },
    {
      "id": "solidaryzm_narodowy",
      "label": "Solidaryzm Narodowy",
      "type": "belief",
      "description": "Koncepcja ponadklasowej solidarności narodowej. Wszystkie warstwy społeczne powinny współpracować dla dobra narodu.",
      "importance": 0.75,
      "sources": []
    },
    {
      "id": "wychowanie_narodowe",
      "label": "Wychowanie Narodowe",
      "type": "belief",
      "description": "Program edukacyjny Balickiego. Kształtowanie świadomości narodowej i charakteru narodowego przez edukację.",
      "theorist": "balicki_zygmunt",
      "importance": 0.7,
      "sources": [
        {
          "title": "Zasady wychowania narodowego",
          "author": "Zygmunt Balicki"
        }
      ]
    },
    {
      "id": "polityka_realna",
      "label": "Polityka Realna",
      "type": "belief",
      "description": "Pragmatyczne podejście do polityki w przeciwieństwie do romantycznego mesjanizmu. Ocena sytuacji międzynarodowej i działanie w ramach możliwości.",
      "importance": 0.75,
      "sources": []
    },
    {
      "id": "ekspansja_kulturalna",
      "label": "Ekspansja Kulturalna",
      "type": "belief",
      "description": "Rozszerzanie polskości przez kulturę, język i edukację. Praca organiczna na ziemiach polskich.",
      "importance": 0.65,
      "sources": []
    },
    {
      "id": "kwestia_zydowska",
      "label": "Kwestia Żydowska",
      "type": "belief",
      "description": "Postulat izolacji gospodarczej i kulturalnej Żydów. Bojkot gospodarczy, numerus clausus na uczelniach. Antysemityzm ekonomiczny, nie rasowo-biologiczny.",
      "importance": 0.7,
      "sources": []
    },
    {
      "id": "nasz_patriotyzm",
      "label": "Nasz patriotyzm",
      "type": "publication",
      "dates": "1893",
      "date": "1893",
      "description": "Broszura programowa nowo założonej Ligi Narodowej autorstwa Dmowskiego. Podstawy programu współczesnej polityki narodowej.",
      "author": "dmowski_roman",
      "importance": 0.85,
      "sources": []
    },
    {
      "id": "psychologia_spoleczna",
      "label": "Psychologia społeczna",
      "type": "publication",
      "author": "balicki_zygmunt",
      "description": "Dzieło Balickiego o psychologii mas i zachowaniach społecznych.",
      "importance": 0.7,
      "sources": []
    },
    {
      "id": "wychowanie_narodowe_pub", // Renamed to avoid collision with belief
      "label": "Zasady wychowania narodowego",
      "type": "publication",
      "author": "balicki_zygmunt",
      "description": "Program edukacji narodowej Balickiego.",
      "importance": 0.7,
      "sources": []
    },
    {
      "id": "polityka_narodowa_panstwie",
      "label": "Polityka narodowa w odbudowanym państwie",
      "type": "publication",
      "dates": "1920s",
      "author": "dmowski_roman",
      "description": "Wizja polityki narodowej w odrodzonej Polsce.",
      "importance": 0.75,
      "sources": []
    },
    {
      "id": "swiat_powojenny",
      "label": "Świat powojenny i Polska",
      "type": "publication",
      "author": "dmowski_roman",
      "description": "Analiza sytuacji międzynarodowej po I wojnie światowej.",
      "importance": 0.65,
      "sources": []
    },
    {
      "id": "gospodarka_narodowa",
      "label": "Gospodarka narodowa",
      "type": "publication",
      "author": "doboszynski_adam",
      "description": "Koncepcja gospodarki narodowej Doboszyńskiego.",
      "importance": 0.6,
      "sources": []
    },
    {
      "id": "powstanie_zetu",
      "label": "Powstanie Związku Młodzieży Polskiej 'Zet'",
      "type": "event",
      "dates": "1887",
      "date": "1887",
      "description": "Balicki założył Związek Młodzieży Polskiej 'Zet', organizację młodzieżową.",
      "importance": 0.7,
      "sources": []
    },
    {
      "id": "powstanie_glosu",
      "label": "Powstanie tygodnika Głos",
      "type": "event",
      "dates": "1886",
      "date": "1886",
      "description": "Popławski współtworzył tygodnik Głos, platformę dla rozwoju wczesnej myśli narodowo-demokratycznej.",
      "importance": 0.65,
      "sources": []
    },
    {
      "id": "rozwiazanie_owp",
      "label": "Rozwiązanie Obozu Wielkiej Polski",
      "type": "event",
      "dates": "1933",
      "date": "1933",
      "description": "Władze sanacyjne rozwiązały Obóz Wielkiej Polski.",
      "importance": 0.7,
      "sources": []
    },
    {
      "id": "wybory_1922",
      "label": "Wybory parlamentarne 1922",
      "type": "event",
      "dates": "1922",
      "date": "1922",
      "description": "Pierwsze wybory do Sejmu RP. Narodowcy uzyskali znaczącą reprezentację.",
      "importance": 0.6,
      "sources": []
    },
    {
      "id": "wojna_polsko_sowiecka",
      "label": "Wojna polsko-sowiecka",
      "type": "event",
      "dates": "1919-1921",
      "start_date": "1919",
      "end_date": "1921",
      "description": "Konflikt zbrojny między Polską a Rosją sowiecką. ND wspierała obronę Polski.",
      "importance": 0.85,
      "sources": []
    },
    {
      "id": "nka",
      "label": "Naczelny Komitet Akademicki",
      "type": "org",
      "dates": "1920s-1930s",
      "description": "Prawny reprezentant i władza ogółu polskiej młodzieży akademickiej. Kierowany przez Młodzież Wszechpolską. Wybierany na 2 lata przez Zjazd Ogólnoakademicki.",
      "character": "organizacja studencka",
      "importance": 0.65,
      "sources": []
    },
    {
      "id": "cie",
      "label": "Confédération Internationale des Étudiants",
      "type": "org",
      "description": "Międzynarodowa Konferencja Studentów. Polska delegacja kierowana przez Młodzież Wszechpolską zajmowała pierwsze miejsce.",
      "character": "organizacja międzynarodowa",
      "importance": 0.5,
      "sources": []
    },
    {
      "id": "liga_polska",
      "label": "Liga Polska",
      "type": "org",
      "dates": "1887-1893",
      "founding_date": "1887",
      "dissolution_date": "1893",
      "description": "Poprzedniczka Ligi Narodowej. Dmowski został członkiem w 1887, przekształcił ją w Ligę Narodową w 1893.",
      "importance": 0.65,
      "sources": []
    }
  ],
  "edges": [
    {
      "source": "dmowski_roman",
      "target": "liga_narodowa",
      "relationship": "założył",
      "dates": "1893",
      "description": "Dmowski współzałożył Ligę Narodową"
    },
    {
      "source": "poplawski_jan",
      "target": "liga_narodowa",
      "relationship": "współzałożył",
      "dates": "1893",
      "description": "Popławski współzałożył Ligę Narodową"
    },
    {
      "source": "balicki_zygmunt",
      "target": "liga_narodowa",
      "relationship": "współzałożył",
      "dates": "1893",
      "description": "Balicki współzałożył Ligę Narodową"
    },
    {
      "source": "dmowski_roman",
      "target": "egoizm_narodowy_concept",
      "relationship": "propagował",
      "dates": "1900s",
      "description": "Dmowski propagował egoizm narodowy"
    },
    {
      "source": "balicki_zygmunt",
      "target": "egoizm_narodowy_concept",
      "relationship": "sformułował teorię",
      "dates": "1902",
      "description": "Balicki stworzył teorię egoizmu narodowego"
    },
    {
      "source": "dmowski_roman",
      "target": "koncepcja_piastowska",
      "relationship": "opracował",
      "dates": "1903",
      "description": "Dmowski rozwinął koncepcję piastowską"
    },
    {
      "source": "poplawski_jan",
      "target": "swiadomosc_narodowa",
      "relationship": "teoretyzował",
      "dates": "1904",
      "description": "Popławski rozwinął teorię świadomości narodowej"
    },
    {
      "source": "liga_narodowa",
      "target": "snd",
      "relationship": "przekształciła się",
      "dates": "1897",
      "description": "Liga Narodowa stała się jawną partią SND"
    },
    {
      "source": "snd",
      "target": "stronnictwo_narodowe",
      "relationship": "zreformowała się",
      "dates": "1928",
      "description": "SND przekształciło się w Stronnictwo Narodowe"
    },
    {
      "source": "dmowski_roman",
      "target": "snd",
      "relationship": "kierował",
      "dates": "1897-1919",
      "description": "Dmowski był przywódcą SND"
    },
    {
      "source": "dmowski_roman",
      "target": "komitet_narodowy",
      "relationship": "kierował",
      "dates": "1917-1919",
      "description": "Dmowski przewodził Komitetowi Narodowemu Polskiemu"
    },
    {
      "source": "dmowski_roman",
      "target": "owp",
      "relationship": "założył",
      "dates": "1926",
      "description": "Dmowski powołał do życia OWP"
    },
    {
      "source": "dmowski_roman",
      "target": "stronnictwo_narodowe",
      "relationship": "wpływał",
      "dates": "1928-1939",
      "description": "Dmowski wpływał na Stronnictwo Narodowe"
    },
    {
      "source": "poplawski_jan",
      "target": "przeglad_wszechpolski",
      "relationship": "redagował",
      "dates": "1895-1905",
      "description": "Popławski redagował Przegląd Wszechpolski"
    },
    {
      "source": "dmowski_roman",
      "target": "przeglad_wszechpolski",
      "relationship": "współpracował",
      "dates": "1895-1905",
      "description": "Dmowski współpracował z Przeglądem"
    },
    {
      "source": "dmowski_roman",
      "target": "mysli_polaka",
      "relationship": "napisał",
      "dates": "1903",
      "description": "Dmowski jest autorem Myśli nowoczesnego Polaka"
    },
    {
      "source": "balicki_zygmunt",
      "target": "egoizm_narodowy",
      "relationship": "napisał",
      "dates": "1902",
      "description": "Balicki napisał Egoizm narodowy wobec etyki"
    },
    {
      "source": "poplawski_jan",
      "target": "polak",
      "relationship": "redagował",
      "dates": "1900-1908",
      "description": "Popławski redagował miesięcznik Polak"
    },
    {
      "source": "mosdorf_jan",
      "target": "akademik_polityka",
      "relationship": "napisał",
      "dates": "1929",
      "description": "Mosdorf napisał Akademik i polityka"
    },
    {
      "source": "rybarski_roman",
      "target": "sila_prawo",
      "relationship": "napisał",
      "dates": "1936",
      "description": "Rybarski napisał Siła i prawo"
    },
    {
      "source": "dmowski_roman",
      "target": "zalozenie_ligi",
      "relationship": "uczestniczył",
      "dates": "1893",
      "description": "Dmowski uczestniczył w założeniu Ligi"
    },
    {
      "source": "dmowski_roman",
      "target": "udzial_w_dumie",
      "relationship": "reprezentował Polskę",
      "dates": "1906-1917",
      "description": "Dmowski był posłem do Dumy"
    },
    {
      "source": "dmowski_roman",
      "target": "konferencja_paryska",
      "relationship": "reprezentował Polskę",
      "dates": "1919",
      "description": "Dmowski reprezentował Polskę w Wersalu"
    },
    {
      "source": "dmowski_roman",
      "target": "smierc_dmowskiego",
      "relationship": "podmiot wydarzenia",
      "dates": "1939",
      "description": "Śmierć Dmowskiego"
    },
    {
      "source": "dmowski_roman",
      "target": "rewolucja_1905",
      "relationship": "przeciwstawił się",
      "dates": "1905",
      "description": "Dmowski sprzeciwił się rewolucji"
    },
    {
      "source": "dmowski_roman",
      "target": "powstanie_owp",
      "relationship": "zainicjował",
      "dates": "1926",
      "description": "Dmowski założył OWP"
    },
    {
      "source": "dmowski_roman",
      "target": "pilsudski_jozef",
      "relationship": "rywalizował",
      "dates": "1900-1935",
      "description": "Dmowski i Piłsudski byli rywalami politycznymi"
    },
    {
      "source": "pilsudski_jozef",
      "target": "zamach_majowy",
      "relationship": "przeprowadził",
      "dates": "1926",
      "description": "Piłsudski dokonał zamachu majowego"
    },
    {
      "source": "stronnictwo_narodowe",
      "target": "zamach_majowy",
      "relationship": "sprzeciwiło się",
      "dates": "1926",
      "description": "SN sprzeciwiło się zamachowi"
    },
    {
      "source": "mosdorf_jan",
      "target": "mlodziez_wszechpolska",
      "relationship": "kierował",
      "dates": "1920s",
      "description": "Mosdorf był przywódcą Młodzieży Wszechpolskiej"
    },
    {
      "source": "mlodziez_wszechpolska",
      "target": "owp",
      "relationship": "organ na uczelniach",
      "dates": "1926-1933",
      "description": "MW była organem OWP na uczelniach"
    },
    {
      "source": "grabski_wladyslaw",
      "target": "stronnictwo_narodowe",
      "relationship": "członek",
      "dates": "1920s",
      "description": "Grabski był członkiem SN"
    },
    {
      "source": "rybarski_roman",
      "target": "stronnictwo_narodowe",
      "relationship": "poseł i przewodniczący klubu",
      "dates": "1928-1935",
      "description": "Rybarski był posłem SN"
    },
    {
      "source": "dmowski_roman",
      "target": "poplawski_jan",
      "relationship": "współpracował",
      "dates": "1893-1908",
      "description": "Współpraca Dmowskiego i Popławskiego"
    },
    {
      "source": "dmowski_roman",
      "target": "balicki_zygmunt",
      "relationship": "współpracował",
      "dates": "1893-1916",
      "description": "Współpraca Dmowskiego i Balickiego"
    },
    {
      "source": "poplawski_jan",
      "target": "balicki_zygmunt",
      "relationship": "współpracował",
      "dates": "1893-1908",
      "description": "Współpraca Popławskiego i Balickiego"
    },
    {
      "source": "grabski_wladyslaw",
      "target": "grabski_stanislaw",
      "relationship": "bracia",
      "dates": "1874-1938",
      "description": "Bracia Grabscy"
    },
    {
      "source": "paderewski_ignacy",
      "target": "konferencja_paryska",
      "relationship": "współsygnatariusz",
      "dates": "1919",
      "description": "Paderewski podpisał Traktat Wersalski"
    },
    {
      "source": "paderewski_ignacy",
      "target": "dmowski_roman",
      "relationship": "współpracował",
      "dates": "1919",
      "description": "Współpraca na konferencji paryskiej"
    },
    {
      "source": "romer_eugeniusz",
      "target": "konferencja_paryska",
      "relationship": "ekspert geograficzny",
      "dates": "1919",
      "description": "Romer doradca ds. granic"
    },
    {
      "source": "romer_eugeniusz",
      "target": "dmowski_roman",
      "relationship": "współpracował",
      "dates": "1919",
      "description": "Współpraca przy ustalaniu granic"
    },
    {
      "source": "seyda_mariano",
      "target": "stronnictwo_narodowe",
      "relationship": "członek",
      "dates": "1920s",
      "description": "Seyda działacz SN"
    },
    {
      "source": "seyda_mariano",
      "target": "dmowski_roman",
      "relationship": "współpracował",
      "dates": "1920s",
      "description": "Współpraca polityczna"
    },
    {
      "source": "stroński_stanislaw",
      "target": "stronnictwo_narodowe",
      "relationship": "publicysta",
      "dates": "1920s-1930s",
      "description": "Stroński publicysta SN"
    },
    {
      "source": "giertych_jędrzej",
      "target": "onr",
      "relationship": "przywódca",
      "dates": "1934",
      "description": "Giertych lider ONR"
    },
    {
      "source": "giertych_jędrzej",
      "target": "stronnictwo_narodowe",
      "relationship": "odłączył się",
      "dates": "1934",
      "description": "Odłączenie od SN"
    },
    {
      "source": "doboszynski_adam",
      "target": "stronnictwo_narodowe",
      "relationship": "członek",
      "dates": "1920s-1930s",
      "description": "Doboszyński członek SN"
    },
    {
      "source": "doboszynski_adam",
      "target": "owp",
      "relationship": "członek",
      "dates": "1926-1933",
      "description": "Doboszyński w OWP"
    },
    {
      "source": "doboszynski_adam",
      "target": "gospodarka_narodowa",
      "relationship": "napisał",
      "description": "Autor koncepcji gospodarki narodowej"
    },
    {
      "source": "demokracja_narodowa",
      "target": "liga_narodowa",
      "relationship": "idea założycielska",
      "dates": "1893",
      "description": "ND jako zasada ruchu"
    },
    {
      "source": "solidaryzm_narodowy",
      "target": "owp",
      "relationship": "zasada organizacyjna",
      "dates": "1926",
      "description": "Ponadklasowość OWP"
    },
    {
      "source": "wychowanie_narodowe",
      "target": "balicki_zygmunt",
      "relationship": "opracował",
      "description": "Balicki autor teorii wychowania"
    },
    {
      "source": "polityka_realna",
      "target": "dmowski_roman",
      "relationship": "propagował",
      "description": "Dmowski zwolennik realizmu politycznego"
    },
    {
      "source": "ekspansja_kulturalna",
      "target": "poplawski_jan",
      "relationship": "teoretyzował",
      "description": "Popławski o ekspansji kulturalnej"
    },
    {
      "source": "kwestia_zydowska",
      "target": "mlodziez_wszechpolska",
      "relationship": "walka",
      "dates": "1920s-1930s",
      "description": "MW walczyła z żydami"
    },
    {
      "source": "dmowski_roman",
      "target": "nasz_patriotyzm",
      "relationship": "napisał",
      "dates": "1893",
      "description": "Broszura założycielska LN"
    },
    {
      "source": "balicki_zygmunt",
      "target": "psychologia_spoleczna",
      "relationship": "napisał",
      "description": "Balicki o psychologii społecznej"
    },
    {
      "source": "balicki_zygmunt",
      "target": "wychowanie_narodowe_pub",
      "relationship": "napisał",
      "description": "Program wychowania narodowego"
    },
    {
      "source": "dmowski_roman",
      "target": "polityka_narodowa_panstwie",
      "relationship": "napisał",
      "dates": "1920s",
      "description": "Polityka w odrodzonej Polsce"
    },
    {
      "source": "dmowski_roman",
      "target": "swiat_powojenny",
      "relationship": "napisał",
      "description": "Analiza sytuacji powojennej"
    },
    {
      "source": "balicki_zygmunt",
      "target": "powstanie_zetu",
      "relationship": "założył",
      "dates": "1887",
      "description": "Balicki założył Zet"
    },
    {
      "source": "poplawski_jan",
      "target": "powstanie_glosu",
      "relationship": "współtworzył",
      "dates": "1886",
      "description": "Popławski współtworzył Głos"
    },
    {
      "source": "owp",
      "target": "rozwiazanie_owp",
      "relationship": "rozwiązano",
      "dates": "1933",
      "description": "Rozwiązanie OWP przez sanację"
    },
    {
      "source": "stronnictwo_narodowe",
      "target": "wybory_1922",
      "relationship": "uczestniczyło",
      "dates": "1922",
      "description": "SN w wyborach 1922"
    },
    {
      "source": "dmowski_roman",
      "target": "wojna_polsko_sowiecka",
      "relationship": "wspierał obronę",
      "dates": "1919-1921",
      "description": "ND za obroną Polski"
    },
    {
      "source": "mlodziez_wszechpolska",
      "target": "nka",
      "relationship": "kierowała",
      "dates": "1920s-1930s",
      "description": "MW kierowała NKA"
    },
    {
      "source": "nka",
      "target": "cie",
      "relationship": "reprezentowała Polskę",
      "dates": "1920s-1930s",
      "description": "NKA w CIE"
    },
    {
      "source": "liga_polska",
      "target": "liga_narodowa",
      "relationship": "przekształciła się",
      "dates": "1893",
      "description": "Transformacja w LN"
    },
    {
      "source": "dmowski_roman",
      "target": "liga_polska",
      "relationship": "członek",
      "dates": "1887",
      "description": "Dmowski w Lidze Polskiej"
    },
    {
      "source": "balicki_zygmunt",
      "target": "przeglad_wszechpolski",
      "relationship": "współpracował",
      "dates": "1895-1905",
      "description": "Balicki publicysta Przeglądu"
    },
    {
      "source": "wasilewski_leon",
      "target": "przeglad_wszechpolski",
      "relationship": "współpracował",
      "dates": "1895-1905",
      "description": "Wasilewski publicysta"
    },
    {
      "source": "wasilewski_leon",
      "target": "liga_narodowa",
      "relationship": "członek",
      "dates": "1893-1920s",
      "description": "Wasilewski w LN"
    },
    {
      "source": "grabski_stanislaw",
      "target": "grabski_wladyslaw",
      "relationship": "bracia",
      "dates": "1871-1949",
      "description": "Bracia Grabscy"
    },
    {
      "source": "grabski_stanislaw",
      "target": "stronnictwo_narodowe",
      "relationship": "członek",
      "dates": "1920s-1930s",
      "description": "Stanisław Grabski w SN"
    },
    {
      "source": "mosdorf_jan",
      "target": "owp",
      "relationship": "działacz",
      "dates": "1926-1933",
      "description": "Mosdorf w OWP"
    },
    {
      "source": "mosdorf_jan",
      "target": "stronnictwo_narodowe",
      "relationship": "członek",
      "dates": "1928-1939",
      "description": "Mosdorf w SN"
    },
    {
      "source": "rybarski_roman",
      "target": "owp",
      "relationship": "członek",
      "dates": "1926-1933",
      "description": "Rybarski w OWP"
    },
    {
      "source": "mysli_polaka",
      "target": "egoizm_narodowy_concept",
      "relationship": "propaguje",
      "dates": "1903",
      "description": "Myśli... propagują egoizm narodowy"
    },
    {
      "source": "mysli_polaka",
      "target": "koncepcja_piastowska",
      "relationship": "przedstawia",
      "dates": "1903",
      "description": "Myśli... o koncepcji piastowskiej"
    },
    {
      "source": "egoizm_narodowy",
      "target": "egoizm_narodowy_concept",
      "relationship": "definiuje",
      "dates": "1902",
      "description": "Egoizm... definiuje koncepcję"
    },
    {
      "source": "nasz_patriotyzm",
      "target": "liga_narodowa",
      "relationship": "broszura programowa",
      "dates": "1893",
      "description": "Broszura programowa LN"
    },
    {
      "source": "wychowanie_narodowe_pub",
      "target": "wychowanie_narodowe",
      "relationship": "przedstawia koncepcję",
      "description": "Publikacja o wychowaniu"
    },
    {
      "source": "powstanie_zetu",
      "target": "liga_narodowa",
      "relationship": "poprzedził",
      "dates": "1887",
      "description": "Zet przed LN"
    },
    {
      "source": "powstanie_glosu",
      "target": "przeglad_wszechpolski",
      "relationship": "poprzedził",
      "dates": "1886",
      "description": "Głos przed Przeglądem"
    },
    {
      "source": "snd",
      "target": "komitet_narodowy",
      "relationship": "delegowała do",
      "dates": "1917",
      "description": "SND w Komitecie"
    },
    {
      "source": "owp",
      "target": "stronnictwo_narodowe",
      "relationship": "współpracował",
      "dates": "1928-1933",
      "description": "Współpraca OWP i SN"
    },
    {
      "source": "mlodziez_wszechpolska",
      "target": "wybory_1922",
      "relationship": "aktywna",
      "dates": "1922",
      "description": "MW w kampanii 1922"
    },
    {
      "source": "komitet_narodowy",
      "target": "konferencja_paryska",
      "relationship": "uczestniczył",
      "dates": "1919",
      "description": "KNP w Paryżu"
    },
    {
      "source": "onr",
      "target": "stronnictwo_narodowe",
      "relationship": "odłączył się od",
      "dates": "1934",
      "description": "ONR odłam SN"
    },
    {
      "source": "dmowski_roman",
      "target": "rewolucja_1905",
      "relationship": "przeciwstawił się",
      "dates": "1905",
      "description": "Dmowski przeciw rewolucji"
    },
    {
      "source": "polityka_narodowa_panstwie",
      "target": "konferencja_paryska",
      "relationship": "opisuje",
      "dates": "1925",
      "description": "Wspomnienia z Wersalu"
    },
    {
      "source": "niemcy_rosja",
      "target": "udzial_w_dumie",
      "relationship": "uzasadnia",
      "dates": "1908",
      "description": "Uzasadnienie polityki w Dumie"
    },
    {
      "source": "powstanie_zetu",
      "target": "mlodziez_wszechpolska",
      "relationship": "inspirował",
      "dates": "1887-1922",
      "description": "Zet inspiracją dla MW"
    },
    {
      "source": "dmowski_roman",
      "target": "mosdorf_jan",
      "relationship": "wpływał",
      "dates": "1920s",
      "description": "Dmowski wpływał na młode pokolenie"
    },
    {
      "source": "dmowski_roman",
      "target": "giertych_jędrzej",
      "relationship": "inspirował",
      "dates": "1920s-1930s",
      "description": "Wpływ na młodych radykałów"
    },
    {
      "source": "balicki_zygmunt",
      "target": "rybarski_roman",
      "relationship": "inspirował",
      "description": "Wpływ teoretyczny Balickiego"
    },
    {
      "source": "mysli_polaka",
      "target": "demokracja_narodowa",
      "relationship": "propaguje",
      "dates": "1903",
      "description": "Myśli... o demokracji narodowej"
    },
    {
      "source": "mysli_polaka",
      "target": "polityka_realna",
      "relationship": "propaguje",
      "dates": "1903",
      "description": "Realizm polityczny w Myślach"
    },
    {
      "source": "egoizm_narodowy",
      "target": "solidaryzm_narodowy",
      "relationship": "łączy się",
      "description": "Egoizm i solidaryzm"
    },
    {
      "source": "liga_narodowa",
      "target": "demokracja_narodowa",
      "relationship": "propagowała",
      "dates": "1893-1928",
      "description": "LN za demokracją narodową"
    },
    {
      "source": "owp",
      "target": "solidaryzm_narodowy",
      "relationship": "propagował",
      "dates": "1926-1933",
      "description": "OWP za solidaryzmem"
    },
    {
      "source": "mlodziez_wszechpolska",
      "target": "kwestia_zydowska",
      "relationship": "walczyła",
      "dates": "1920s-1930s",
      "description": "MW walka z żydami"
    },
    {
      "source": "stronnictwo_narodowe",
      "target": "polityka_realna",
      "relationship": "praktykowało",
      "dates": "1928-1939",
      "description": "SN realizm polityczny"
    },
    {
      "source": "poplawski_jan",
      "target": "grabski_stanislaw",
      "relationship": "współpracował",
      "dates": "1890s-1908",
      "description": "Współpraca Popławskiego i Grabskiego"
    },
    {
      "source": "balicki_zygmunt",
      "target": "wasilewski_leon",
      "relationship": "współpracował",
      "dates": "1890s-1916",
      "description": "Współpraca w LN"
    },
    {
      "source": "poplawski_jan",
      "target": "zalozenie_ligi",
      "relationship": "uczestniczył",
      "dates": "1893",
      "description": "Popławski zakładał LN"
    },
    {
      "source": "balicki_zygmunt",
      "target": "zalozenie_ligi",
      "relationship": "uczestniczył",
      "dates": "1893",
      "description": "Balicki zakładał LN"
    },
    {
      "source": "koncepcja_piastowska",
      "target": "konferencja_paryska",
      "relationship": "realizowana",
      "dates": "1919",
      "description": "Koncepcja piastowska w Wersalu"
    },
    {
      "source": "polityka_wschodnia",
      "target": "udzial_w_dumie",
      "relationship": "realizowana",
      "dates": "1906-1917",
      "description": "Polityka wschodnia w Dumie"
    },
    {
      "source": "ekspansja_kulturalna",
      "target": "polak",
      "relationship": "narzędzie",
      "dates": "1900-1908",
      "description": "Polak jako narzędzie ekspansji"
    }
  ]
};

// Helper to convert raw data to HistoricalNode/Edge format
const convertRawData = (data: typeof ENDECJA_DATA) => {
  const nodes = data.nodes.map(n => ({
    data: {
      id: n.id,
      label: n.label,
      type: n.type as HistoricalNodeType, // Type assertion for HistoricalNodeType
      start: n.dates?.split('-')[0] || n.birth_date || n.date || undefined, // Prioritize 'dates' split, then 'birth_date', 'date'
      end: n.dates?.split('-')[1] || n.death_date || undefined,
      description: n.description,
      // Ensure sources are strings (titles) as per HistoricalNode type
      sources: n.sources?.map((s: { title: string }) => s.title) || [], 
      certainty: 'confirmed' as HistoricalNode['certainty'], // Explicitly cast to literal type
      // x, y, pagerank, etc. will be calculated runtime
    }
  }));

  const edges = data.edges.map((e, i) => ({
    data: {
      id: `e-${e.source}-${e.target}-${i}`, // Unique ID for edges
      source: e.source,
      target: e.target,
      label: e.relationship, // Use relationship as label
      type: e.relationship, // Use relationship as type for now, can be normalized later
      start: e.dates?.split('-')[0] || undefined,
      end: e.dates?.split('-')[1] || undefined,
      weight: 1.0, // Default weight
      // Explicitly cast 'sign' to literal type
      sign: (e.relationship.includes('rywalizował') || e.relationship.includes('sprzeciwił się') || e.relationship.includes('odłączył się') ? 'negative' : 'positive') as HistoricalEdge['sign'],
      sources: [], // No specific sources for edges in raw data
      certainty: 'confirmed' as HistoricalEdge['certainty'], // Explicitly cast to literal type
    }
  }));

  return { nodes, edges };
};

const convertedGraph = convertRawData(ENDECJA_DATA);

export const INITIAL_GRAPH: KnowledgeGraph = convertedGraph;

export const COLORS = {
  person: '#3b82f6', // blue
  org: '#ef4444',    // red
  faction: '#f97316', // orange
  event: '#eab308',   // yellow
  belief: '#a855f7',  // purple
  source: '#10b981',  // emerald
  role: '#64748b',    // slate
  time: '#78716c',    // stone
  publication: '#10b981' // emerald for publications
};

export const COMMUNITY_COLORS = [
  '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'
];
