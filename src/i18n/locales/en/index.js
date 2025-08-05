import navbar from './navbar';
import Home from './Home';
import common from './common';
import footer from './footer';
import contact from './contact';
import about from './about';
import birthchart from './horoscope/birthchart';
import matchhoroscope from './horoscope/matchhoroscope';
import ascendant from './horoscope/ascendant';
import dashaanalysis from './horoscope/dashaanalysis';
import nakshatra from './horoscope/nakshatra';
import numerology from './horoscope/numerology';

import careerreport from './predictions/careerreport';
import dailyhoroscope from './predictions/dailyhoroscope';
import lifepredictions from './predictions/lifepredictions';
import healthreport from './predictions/healthreport';
import lovereport from './predictions/lovereport';
import naturereport from './predictions/naturereport';
import personalizedreport from './predictions/personalizedreport';
import yearanalysis from './predictions/yearanalysis';

import askquestion from './remedial/askquestion';
import gemstones from './remedial/gemstones';
import lalkitab from './remedial/lalkitab';
import sadesati from './remedial/sadesati';


export default {
  ...navbar,
  ...Home,
  ...common,
  ...footer,
  ...contact,
  ...about,
  ...birthchart,
  ...matchhoroscope,
  ...ascendant,
  ...dashaanalysis,
  ...nakshatra,
  ...numerology,
  ...careerreport,
  ...dailyhoroscope,
  ...healthreport,
  ...lifepredictions,
  ...lovereport,
  ...naturereport,
  ...personalizedreport,
  ...yearanalysis,
  ...askquestion,
  ...gemstones,
  ...lalkitab,
  ...sadesati
};
