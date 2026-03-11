import icon1 from "../assets/images/icon1.png";
import icon2 from "../assets/images/icon2.png";
import icon3 from "../assets/images/icon3.png";
import icon4 from "../assets/images/icon4.png";
import icon5 from "../assets/images/icon5.png";

export const infoModalContent = {
  ka: {
    title: "რა არის დემოგრაფიული პორტალი?",
    intro:
      "დემოგრაფიული პორტალი არის ვებ-გვერდი, სადაც განთავსებულია საქართველოს დემოგრაფიული მონაცემები, მოსახლეობის სქესობრივ-ასაკობრივი პირამიდა, ინტერაქტიული დიაგრამა ქორწინებების შესახებ სქესობრივ-ასაკობრივ ჭრილში და სიცოცხლის მოსალოდნელი ხანგრძლივობის კალკულატორი.",
    pyramidTitle: "მოსახლეობის პირამიდა",
    pyramidBody:
      "მოსახლეობის პირამიდა წარმოადგენს დიაგრამას, რომელიც აჩვენებს მოსახლეობის სქესობრივ-ასაკობრივ სტრუქტურას. მოსახლეობის პირამიდის მოძრავი დიაგრამის საშუალებით შესაძლებელია მოსახლეობის სტრუქტურის – სქესობრივ-ასაკობრივი შემადგენლობის ცვლილების ნახვა 1926 წლიდან. დიაგრამა 1926, 1939, 1959, 1970, 1979, 1989, 2014 წლებში მოიცავს მოსახლეობის საყოველთაო აღწერების მონაცემებს, ხოლო 1994 წლიდან მონაცემები არ მოიცავს საქართველოს ოკუპირებულ ტერიტორიებს (2002 წელს აფხაზეთის ა.რ. მონაცემები მოიცავს მხოლოდ აჟარის თემს).",
    instructionsTitle: "გამოყენების ინსტრუქცია:",
    instructionsBody: () => (
      <p>
        თავდაპირველად პირამიდა ასახავს საქართველოს მოსახლეობის
        სქესობრივ-ასაკობრივ განაწილებას 2019 წლის 1 იანვრის მდგომარეობით.
        გამშვები ღილაკის (
        <img
          src={icon1}
          alt="Instructions"
          className="mx-1 inline-block h-[1.5em] w-auto rounded align-middle"
        />
        ) გააქტიურების შემდგომ დიაგრამა ასახავს სტატისტიკის ეროვნული
        სამსახურისთვის ხელმისაწვდომ მონაცემებს შესაბამისი წლების მიხედვით.
        მომხმარებლის სურვილის შემთხვევაში „შემდეგი“ და „წინა“ ფუნქციური
        ღილაკების (
        <img
          src={icon2}
          alt="Instructions"
          className="mx-1 inline-block h-[1.5em] w-auto rounded align-middle"
        />
        ) გამოყენებით შესაძლებელია პირამიდის გადაყვანა მომდევნო ან წინა
        ხელმისაწვდომ წელზე. ბლოკირების ფუნქციური ღილაკი (
        <img
          src={icon3}
          alt="Instructions"
          className="mx-1 inline-block h-[1.5em] w-auto rounded align-middle"
        />
        ) მომხმარებელს საშუალებას აძლევს დააფიქსიროს სასურველი წელი და აღნიშნული
        წლის მოსახლეობის სტრუქტურის კონტური შენარჩუნდება სხვა წლებზე
        გადაადგილების მიუხედავად, რაც ამარტივებს მოსახლეობის ასაკობრივი
        სტრუქტურის ცვლილების ხილვას. მომხმარებელს შეუძლია მოსახლეობის პორტალზე
        დამატებით მონიშნოს სამი ასაკობრივი ჯგუფი, რაც შესაძლებელია ჩანართი
        „ასაკობრივი ჯგუფები“-ის გააქტიურების (
        <img
          src={icon4}
          alt="Instructions"
          className="mx-1 inline-block h-[1.5em] w-auto rounded align-middle"
        />
        ) შემდგომ პირამიდის დიაგრამის მარჯვნივ განთავსებულ სვეტზე მოძრავი
        ღილაკის (
        <img
          src={icon5}
          alt="Instructions"
          className="mx-1 inline-block h-[1.5em] w-auto rounded align-middle"
        />
        ) გადაადგილებით. მომხმარებელს დამატებით შეუძლია მონაცემები იხილოს ასევე
        საქართველოს რეგიონების მიხედვით. ამისთვის საჭიროა საქართველოს რუკაზე
        აირჩიოს რეგიონი.
      </p>
    ),
    indicatorsTitle:
      "პორტალზე ასევე შესაძლებელია შემდეგი დემოგრაფიული მაჩვენებლების ნახვა:",
    indicators: [
      "მოსახლეობის რიცხოვნობა და პროცენტული განაწილება სქესის მიხედვით;",
      "სქესთა რაოდენობრივი თანაფარდობის კოეფიციენტი და მოსახლეობის პროცენტული განაწილება სამი ძირითადი ასაკობრივი ჯგუფის მიხედვით;",
      "მოსახლეობის მედიანური ასაკი და სიცოცხლის მოსალოდნელი ხანგრძლივობა დაბადებისას სქესის მიხედვით;",
      "შობადობის ზოგადი კოეფიციენტი;",
      "ბუნებრივი მატება;",
      "მიგრაციული სალდო.",
    ],
    marriageTitle: "ქორწინება",
    marriageBody:
      "ინტერაქტიული დიაგრამა ქორწინებების შესახებ აჩვენებს რეგისტრირებულ ქორწინებათა აბსოლუტურ და პროცენტულ განაწილებას დაქორწინებულთა ასაკების მიხედვით. ვებ-გვერდზე გადასვლის შემდგომ მომხმარებელმა უნდა აირჩიოს დაქორწინებულის ასაკი (მამაკაცის ან ქალის) და შედეგი უჩვენებს ქორწინებათა რაოდენობას პარტნიორის ასაკის მიხედვით.",
    noteTitle: "შენიშვნა",
    noteBody:
      "შენიშვნა: 2017 წლიდან მონაცემები არ მოიცავს 18 წლამდე ასაკის პირთა რეგისტრირებულ ქორწინებების რიცხვს, რაც განპირობებულია საქართველოს სამოქალაქო კოდექსში განხორციელებული ცვლილებებით.",
    lifeTitle: "სიცოცხლის მოსალოდნელი ხანგრძლივობის კალკულატორი",
    lifeBody:
      "ინტერაქტიული კალკულატორით სარგებლობისთვის, მომხმარებელმა უნდა აირჩიოს ასაკი (0-85 წლის ინტერვალში) და სქესი.მომხმარებელი მიიღებს ინფორმაციას სიცოცხლის მოსალოდნელი ხანგრძლივობის შესახებ 2018 წლის მონაცემების მიხედვით.",
    methodologyTitle: "სრული მეთოდოლოგია იხილეთ აქ:",
    methodologyLink:
      "https://www.geostat.ge/media/23365/mosaxleoba-da-demograpia-%28geo%29.pdf",
    closeTitle: "დახურვა",
  },
  en: {
    title: "What is Demographic Portal?",
    intro:
      "Demographic Portal is the website that contains demographic data on Georgia, age-sex pyramid of the population, interactive chart on marriages and life expectancy calculator.",
    pyramidTitle: "Population Pyramid",
    pyramidBody:
      "The population pyramid is a diagram showing the age-sex structure of the population. Moving through the population pyramid diagram allows us to see the change in population structure – age and sex composition since 1926. The graphs for 1926, 1939, 1959, 1970, 1979, 1989, 2014 are according to the census data, since 1994 data do not cover the occupied territories of Georgia (in 2002 data on Abkhazia include the community of Ajara only).",
    instructionsTitle: "Instructions for use:",
    instructionsBody: () => (
      <p>
        Initially, the population pyramid reflects the age-sex distribution of
        the population of Georgia as of January 1, 2019. After the activation of
        the launch-button (
        <img
          src={icon1}
          alt="Instructions"
          className="mx-1 inline-block h-[1.5em] w-auto rounded align-middle"
        />
        ) the chart shows the data available to the National Statistics Office
        by the relevant years. The "Next"/"Previous" functional buttons (
        <img
          src={icon2}
          alt="Instructions"
          className="mx-1 inline-block h-[1.5em] w-auto rounded align-middle"
        />
        ) switch the pyramid to the next/previous available year. The lock
        function button (
        <img
          src={icon3}
          alt="Instructions"
          className="mx-1 inline-block h-[1.5em] w-auto rounded align-middle"
        />
        ) allows the user to specify the desired year and the outline of the
        population structure of that year will be fixed, making it easier to see
        the age structure change in the different years in comparison to the
        “frozen” one. Additionally, on the population pyramid the user can
        select three age groups, which can be set by moving the button (
        <img
          src={icon4}
          alt="Instructions"
          className="mx-1 inline-block h-[1.5em] w-auto rounded align-middle"
        />
        ) on the column on the right-hand side of pyramid diagram after
        activating the Age Groups tab. Users can also view data by regions of
        Georgia. To do this, you need to choose the region on the map of
        Georgia.
      </p>
    ),
    indicatorsTitle:
      "The portal also contains the following demographic indicators:",
    indicators: [
      "Number of population and percentage distribution by sex;",
      "Sex ratio and percentage distribution of population by three main age groups;",
      "Median age of the population and life expectancy at birth by sex;",
      "Crude birth rate;",
      "Natural increase;",
      "Net migration.",
    ],
    marriageTitle: "Marriage",
    marriageBody:
      "The interactive chart on marriages shows absolute and percentage distribution of registered marriages according to the ages of partners. Users select the age of the married person (male/female), and the result shows the number of marriages by partner’s age",
    noteTitle: "Note",
    noteBody:
      "Note: From 2017 the data do not cover registered marriages of persons under 18 due to changes in the Civil Code of Georgia.",
    lifeTitle: "Life expectancy calculator",
    lifeBody:
      "To use the interactive calculator, the user must select the age (between 0-85 years) and sex. Users will receive information on their life expectancy based on 2018 data.",
    methodologyTitle: "The full methodology is available at:",
    methodologyLink:
      "https://www.geostat.ge/media/23366/Population-and-Demography-%28eng%29.pdf",
    closeTitle: "Close",
  },
};
