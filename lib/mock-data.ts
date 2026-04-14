import type {
  Story,
  Market,
  Lesson,
  User,
  ResolvedPosition,
} from "@/types";
import { generatePriceHistory } from "./price-utils";

// Fixed reference time to avoid server/client hydration mismatch
const REF = new Date("2026-04-13T12:00:00Z").getTime();

// ─── Stories ────────────────────────────────────────────────────────

export const stories: Story[] = [
  {
    id: "s1",
    topic: "politics",
    title: "The quiet campaign to redraw the *midwestern map* before November",
    summary:
      "Three state legislatures are moving on redistricting proposals that could shift as many as nine House seats. The maps are technical — the political consequences aren't.",
    body: `In a legislative session that most national outlets haven't covered, Ohio's state senate is moving on a redistricting proposal that — if enacted — would affect the partisan composition of as many as four congressional districts. Similar efforts are underway in two neighboring states.

The maps themselves are technical documents. The political mechanics behind them are not. Sources familiar with the draft legislation described the push as "unusually coordinated" for a non-census year.

Academic analysts are divided on whether the proposals would survive judicial review. One redistricting scholar at the University of Michigan called the timing "legally adventurous." Another described the maps as "within the lines, if barely."

The legislative calendar leaves a narrow window. Most states have procedural hurdles that push the earliest realistic enactment date into late July. Whether any of the three states hits that target depends on whose vote counts show up.`,
    publishedAt: new Date(REF - 3 * 60 * 60 * 1000).toISOString(),
    marketId: "m1",
  },
  {
    id: "s2",
    topic: "culture",
    title:
      "A novel about *grief and vending machines* is quietly topping every year-end list",
    summary:
      "Kawamura's debut has sold out three printings. Critics are calling it the strangest Pulitzer contender in a decade.",
    body: `The book doesn't look like much from the outside. A slim volume — 212 pages — with a matte cover showing a single vending machine photographed from slightly below. No blurb. No pull quote. Just a title: "Please Select."

Inside is a novel that has, in the space of three months, become the most discussed work of fiction in the English-speaking literary world. Not because of controversy. Because people keep finishing it and immediately texting someone about it.

Kawamura, 34, a former translator living in Brooklyn, has given exactly one interview since publication. In it, she said she wrote the entire first draft in eleven days, then spent two years revising. The ratio tells you something.

The premise is deceptively simple: a woman returns to the small town where her mother died and finds that the vending machine outside the hospital still works. She begins visiting it nightly. What unfolds is less a plot than a meditation — on objects that outlast us, on the machinery of grief, on the specific loneliness of choosing between options that don't matter.`,
    publishedAt: new Date(REF - 6 * 60 * 60 * 1000).toISOString(),
    marketId: "m2",
  },
  {
    id: "s3",
    topic: "tech",
    title: "The open-source model that's *beating GPT-6* on three benchmarks",
    summary:
      "It was trained on a fraction of the compute. The team is six people in Warsaw. No one in the Bay Area wants to talk about it publicly.",
    body: `The results appeared on a preprint server at 2 a.m. Pacific time, which is how you know the authors weren't trying to time the news cycle. They were trying to time Warsaw's morning.

The model — called Bielik-3, after the white eagle on the Polish coat of arms — outperforms GPT-6 on three of the six major reasoning benchmarks while using roughly one-eighth the estimated training compute. The team behind it is six researchers at the University of Warsaw's newly funded AI laboratory.

In the Bay Area, the reaction has been a combination of professional respect and strategic anxiety. Three separate lab employees, speaking on background, used the word "efficient" as if it were a threat.

The implications are straightforward: if a team of six can match or beat frontier models on key tasks, the moat around large-scale AI labs is thinner than advertised. Whether that moat matters depends on which benchmarks you believe and which products you're building.`,
    publishedAt: new Date(REF - 24 * 60 * 60 * 1000).toISOString(),
    marketId: "m3",
  },
  {
    id: "s4",
    topic: "climate",
    title: "Why the *Atlantic hurricane forecast* keeps getting quieter",
    summary:
      "NOAA's latest seasonal outlook revises storm counts down for the third year in a row. Meteorologists are divided on what this means.",
    body: `For the third consecutive spring, NOAA has revised its Atlantic hurricane season forecast downward. The current prediction — 11 named storms, four hurricanes, one major — would make 2026 one of the least active seasons in recent memory.

The reason isn't simple. A weaker-than-expected El Niño transition is part of it. So is a persistent patch of cool sea surface temperatures in the eastern Atlantic, which meteorologists are watching carefully but can't yet explain with confidence.

The quieter forecasts have created an unusual dynamic: coastal communities are spending less on preparation, while climate scientists warn that a single devastating storm can emerge from even a calm season. Statistical averages, they point out, don't protect individual cities.

The debate among meteorologists centers on whether the declining trend is cyclical or structural. The answer matters for insurance pricing, infrastructure planning, and a dozen other industries that bet on frequency.`,
    publishedAt: new Date(REF - 28 * 60 * 60 * 1000).toISOString(),
    marketId: "m4",
  },
  {
    id: "s5",
    topic: "economy",
    title: "The Fed is running out of *reasons not to cut*",
    summary:
      "With inflation cooling and employment softening, markets are pricing in a July move. The question is whether the committee agrees with the market.",
    body: `The Federal Reserve's next decision is technically six weeks away, but the argument is already over — at least on trading floors. Futures markets are pricing in a 78% probability of a 25 basis-point cut in July, the highest implied certainty since the hiking cycle began.

The data supports the case. Core PCE has decelerated for five consecutive months. Unemployment ticked up to 4.3%. Consumer spending, while not collapsing, has gone unmistakably flat.

The counterargument — which still holds weight inside the committee — is that services inflation remains sticky, and cutting too early risks re-anchoring expectations in the wrong direction. Two regional Fed presidents have made this case publicly in the last ten days.

But the political pressure is building. An election-year rate cut is always delicate, and the committee knows that acting in September would look more political than acting in July. The window for a "clean" cut is narrowing.`,
    publishedAt: new Date(REF - 5 * 60 * 60 * 1000).toISOString(),
    marketId: "m5",
  },
  {
    id: "s6",
    topic: "sports",
    title: "The teenager who might *break the marathon* before she can vote",
    summary:
      "At 17, Mekonnen ran a 2:14 in her first official race. Coaches say the ceiling isn't visible yet.",
    body: `Almaz Mekonnen didn't plan to run a marathon this spring. She planned to run a half-marathon in Addis Ababa and then return to school on Monday. But her coach, watching her splits at the halfway mark, made a quiet decision: he told the pace car to keep going.

Mekonnen finished in 2:14:33 — a time that would have won three of the last five Olympic marathons. She is seventeen.

The running world has seen prodigies before. What makes Mekonnen different, according to coaches and physiologists who have studied her training data, is not her current speed but her efficiency. Her VO2 max, reported at 76, is comparable to elite male runners. Her stride is mechanically unusual: shorter than expected, with almost no vertical oscillation.

The question everyone is asking — will she break 2:10? — is the wrong question, her coach says. "The question is whether we can keep her healthy for five more years." That's the harder race.`,
    publishedAt: new Date(REF - 10 * 60 * 60 * 1000).toISOString(),
    marketId: "m6",
  },
  {
    id: "s7",
    topic: "science",
    title: "A new antibiotic was found in *soil from a parking lot*",
    summary:
      "The compound kills resistant bacteria that nothing else touches. It was isolated by a grad student who wasn't looking for it.",
    body: `The soil sample came from a construction site in Raleigh, North Carolina — specifically, from the edge of a half-demolished parking lot. It was collected as part of a routine undergraduate research exercise. Nobody expected it to contain anything interesting.

But when Maya Torres, a second-year PhD student at Duke, ran the cultured bacteria through a standard resistance panel, something unusual happened: the extract killed methicillin-resistant Staphylococcus aureus — MRSA — at concentrations lower than vancomycin, the current drug of last resort.

The compound, provisionally named torellin, belongs to a previously unknown class of cyclic peptides. Early structural analysis suggests it disrupts the bacterial membrane through a mechanism unlike any existing antibiotic, which could make cross-resistance unlikely.

Torres's advisor, Dr. Rebecca Hale, is cautious. "We're in the parking-lot-dirt stage of drug discovery," she says. "There are hundreds of steps between here and a pharmacy." But infectious disease specialists are watching closely.`,
    publishedAt: new Date(REF - 14 * 60 * 60 * 1000).toISOString(),
    marketId: "m7",
  },
  {
    id: "s8",
    topic: "world",
    title:
      "The island nation that just *banned cars* on weekdays",
    summary:
      "Malta's experiment in radical transport policy begins in June. Residents are divided, but transit ridership has already doubled in anticipation.",
    body: `Starting June 1, private vehicles will be banned from Malta's roads between 7 a.m. and 7 p.m., Monday through Friday. The policy, announced in January after a contentious parliamentary debate, makes Malta the first nation to implement a weekday car ban nationwide.

The island — just 316 square kilometers, smaller than most major cities — has long suffered from some of the worst traffic congestion in Europe. With over 400,000 registered vehicles for a population of 540,000, the car-to-person ratio was unsustainable.

The government's solution is aggressive: a dramatically expanded bus network, subsidized e-bike purchases, and a fleet of autonomous shuttles currently being tested in Valletta's harbor district. Enforcement will rely on a network of cameras already installed for a separate congestion-pricing pilot.

Reaction has been polarized. Younger residents and tourists are broadly supportive. Older residents and business owners in outlying villages are not. A legal challenge is expected.`,
    publishedAt: new Date(REF - 18 * 60 * 60 * 1000).toISOString(),
    marketId: "m8",
  },
  {
    id: "s9",
    topic: "entertainment",
    title:
      "The documentary that *Hollywood doesn't want you to stream* just won Cannes",
    summary:
      "A film about studio accounting practices took the Palme d'Or. Distributors are reportedly nervous about its theatrical release.",
    body: `"The Ledger," a 97-minute documentary about the creative accounting practices of major Hollywood studios, won the Palme d'Or at Cannes on Saturday evening. It is the first documentary to win the festival's top prize in 18 years.

The film, directed by Sarah Kwan, uses internal documents from three studio mergers to trace how profits from blockbuster films are systematically reclassified to minimize payments to talent with net-profit participation deals. The accounting is legal. The film argues it shouldn't be.

Several major distributors have reportedly declined to acquire U.S. theatrical rights, citing "market fit" concerns. Independent distributor A24 is said to be in negotiations.

The director, speaking backstage, was characteristically dry: "If a documentary about spreadsheets can win the Palme d'Or, I think we can agree that the spreadsheets are interesting."`,
    publishedAt: new Date(REF - 22 * 60 * 60 * 1000).toISOString(),
    marketId: "m9",
  },
  {
    id: "s10",
    topic: "politics",
    title: "She hasn't announced — but her *fundraising says otherwise*",
    summary:
      "A sitting governor's PAC raised $14M last quarter while she publicly denied interest in a presidential run. The math tells a different story.",
    body: `Governor Maria Chen of Colorado raised $14.2 million through her leadership PAC in the first quarter of 2026 — more than any non-declared candidate in the party's history for that period. Her spokesperson called it "organic grassroots support" and reiterated that the governor is "focused on Colorado."

The numbers tell a different story. The PAC's spending includes $2.1 million in Iowa and $1.8 million in New Hampshire — states where Colorado governors have no particular business. Staffing patterns show a familiar shape: a former Obama field director was hired in February; a respected pollster signed on in March.

Political operatives in both parties are treating Chen's candidacy as a near-certainty. The only question is timing. One advisor, speaking anonymously, described the calculation: "She's waiting for one other person to get in first, so she doesn't look like the frontrunner too early." Which is, of course, exactly what a frontrunner would do.`,
    publishedAt: new Date(REF - 8 * 60 * 60 * 1000).toISOString(),
    marketId: "m10",
  },
  {
    id: "s11",
    topic: "tech",
    title: "Why your *smart fridge* is the weakest link in your home network",
    summary:
      "A new study found that IoT kitchen appliances have the worst security posture of any consumer device category. The exploits are embarrassingly simple.",
    body: `The study, published this week by researchers at ETH Zurich, examined 87 internet-connected kitchen appliances from 14 manufacturers. The findings are bleak: 72% used unencrypted HTTP for at least some communications. 41% had hardcoded credentials. One model — a popular smart refrigerator — broadcast its owner's Wi-Fi password in plaintext every 30 seconds.

The researchers describe a class of attack they call "kitchen pivoting," where a compromised appliance serves as an entry point into the home network. From there, attackers can reach laptops, phones, and NAS devices on the same network.

The manufacturers' responses ranged from silence to defensiveness. One company said the vulnerability was "theoretical." The researchers demonstrated it in under four minutes.

The underlying problem is economic: security costs money, and consumers won't pay a premium for a toaster that encrypts its firmware updates. Until that incentive changes, your kitchen will remain the softest target in your house.`,
    publishedAt: new Date(REF - 32 * 60 * 60 * 1000).toISOString(),
    marketId: "m11",
  },
  {
    id: "s12",
    topic: "climate",
    title:
      "The glacier that *grew back* — and what it actually means",
    summary:
      "A Patagonian glacier advanced 200 meters last year, delighting skeptics and alarming glaciologists for entirely different reasons.",
    body: `The Perito Moreno glacier in southern Argentina advanced approximately 200 meters between March 2025 and March 2026, according to measurements published by the Argentine Institute of Nivology, Glaciology, and Environmental Sciences. It is one of very few glaciers on Earth currently gaining mass.

The finding was immediately seized upon by climate skeptics as evidence that warming trends are overstated. Glaciologists see it differently: Perito Moreno's growth is driven by increased precipitation in the region — precipitation that comes from warmer ocean temperatures evaporating more water into the atmosphere.

"A growing glacier in a warming world isn't a contradiction," said Dr. Lucas Ruiz, the study's lead author. "It's a symptom. The water cycle is intensifying. Some places get floods. This one gets ice."

The glacier has long been an anomaly. Its peculiar geography — it sits in a narrow channel between two lake bodies — creates conditions that trap snowfall more efficiently than typical glacier basins. It is, in a sense, the exception that proves the rule.`,
    publishedAt: new Date(REF - 36 * 60 * 60 * 1000).toISOString(),
    marketId: "m12",
  },
  {
    id: "s13",
    topic: "economy",
    title: "The housing market's *strange new math*",
    summary:
      "Mortgage applications are up 22% but prices are flat. Economists are calling it a normalization. Builders are calling it a trap.",
    body: `Something unusual is happening in American housing: people are applying for mortgages again, but prices aren't rising. For the first time since the pandemic, demand is increasing without inflating asset values.

Economists at the National Association of Realtors attribute the shift to a combination of factors: rates dipping below 6% for the first time in two years, increased inventory from new construction, and a generational shift in buyer expectations. Millennials, who delayed homebuying longer than any generation in modern history, are entering the market with different assumptions about price appreciation.

Builders, however, see a trap. Construction costs remain high, and flat prices mean thinner margins. Several publicly traded homebuilders have revised earnings guidance downward, citing what one CEO called "demand without pricing power."

The question for markets is whether this is a healthy normalization — housing becoming less speculative, more functional — or the early stage of a correction that hasn't fully materialized yet.`,
    publishedAt: new Date(REF - 12 * 60 * 60 * 1000).toISOString(),
    marketId: "m13",
  },
  {
    id: "s14",
    topic: "culture",
    title: "The museum that *only opens when it rains*",
    summary:
      "A new installation in Copenhagen ties its visiting hours to the weather. Critics love it. Tourists are confused.",
    body: `The Museum of Water, Copenhagen's newest and most deliberately inconvenient cultural institution, opened on April 1 — or rather, it opened on April 3, because April 1 and 2 were sunny.

The museum's single rule: it is only accessible when it is raining. Visitors check a live weather feed on the museum's website; when precipitation begins, the doors unlock automatically. When it stops, visitors have fifteen minutes to exit.

The permanent collection consists of 400 glass vessels, each containing water from a different location — a melting glacier, a baptismal font, a rice paddy, a desalination plant. The installations are designed to look and sound different depending on the weather outside.

The concept is the work of Danish-Japanese artist Yuki Sørensen, who has spent a decade exploring what she calls "conditional art" — work that exists only under specific physical circumstances. "If you can see it whenever you want," she told a Danish newspaper, "it isn't really about water."`,
    publishedAt: new Date(REF - 40 * 60 * 60 * 1000).toISOString(),
    marketId: "m14",
  },
  {
    id: "s15",
    topic: "sports",
    title: "The chess prodigy who *refuses to play online*",
    summary:
      "At 14, Dubois is the youngest player to reach 2700 Elo. He insists on playing only over the board. His reasons are surprisingly thoughtful.",
    body: `Étienne Dubois does not have a Chess.com account. He does not have a Lichess account. He has never played a rated game online. He is also, at fourteen years and three months, the youngest player in history to reach a FIDE rating of 2700.

His reasoning, articulated in a rare interview with a French chess magazine, is disarmingly simple: "When I play someone, I want to see their hands. You can learn things from hands that you can't learn from a screen."

Dubois's coach, former world championship candidate Étienne Bacrot, supports the approach. "Online chess trains pattern recognition," he says. "Over-the-board chess trains judgment. They're related but not the same. Étienne is being trained for judgment."

The chess world is watching Dubois with a mixture of admiration and curiosity. In an era where virtually every top player hones their skills through thousands of online blitz games, his refusal feels either principled or quixotic — possibly both.`,
    publishedAt: new Date(REF - 44 * 60 * 60 * 1000).toISOString(),
    marketId: "m15",
  },
  {
    id: "s16",
    topic: "world",
    title: "The city that *runs on four-day weeks* — one year later",
    summary:
      "Valencia's municipal experiment in reduced work hours has completed its first full year. The results are complicated.",
    body: `One year ago, Valencia became the first major European city to shift its entire municipal workforce — roughly 8,000 employees — to a four-day, 32-hour workweek at full pay. The experiment, controversial from the start, has now produced enough data to evaluate.

The headline numbers are positive: employee satisfaction is up 34%, sick days are down 18%, and the city's service delivery metrics — response times for permits, complaints, and inspections — have remained essentially flat.

But the picture is more nuanced than the summary suggests. Certain departments — waste management, emergency services, social work — required hiring additional staff to maintain coverage, increasing personnel costs by an estimated 8%. The city offset this partly through reduced overtime payments and lower turnover-related recruiting costs.

The national government is watching closely. If Valencia's experiment is deemed a success, pressure to expand the policy to other cities will be significant. If it's deemed too expensive, it becomes a cautionary tale. The truth, as usual, is somewhere in the middle.`,
    publishedAt: new Date(REF - 48 * 60 * 60 * 1000).toISOString(),
    marketId: "m16",
  },
  {
    id: "s17",
    topic: "science",
    title: "We may have found *the universe's missing matter* — in a web of gas",
    summary:
      "A new X-ray survey detected filaments of hot gas connecting galaxy clusters. It accounts for almost exactly the amount of baryonic matter that's been missing.",
    body: `For decades, cosmologists have faced an embarrassing accounting problem: the amount of ordinary matter predicted by Big Bang nucleosynthesis models didn't match what we could actually see. About 30-40% of the universe's baryonic matter was unaccounted for — not dark matter, not dark energy, just regular matter that should have been there but wasn't.

A new paper in Nature, based on data from the eROSITA X-ray telescope, reports the detection of vast filaments of hot, diffuse gas stretching between galaxy clusters. The filaments, heated to millions of degrees, emit X-rays too faint for previous instruments to detect.

The total mass in these filaments, extrapolated across the observable universe, accounts for 35 ± 8% of total baryonic matter — almost exactly the missing fraction.

"It was always there," said Dr. Esra Bulbul, lead author on the study. "We just didn't have eyes sensitive enough to see it." The finding doesn't solve any deep mystery about the universe's composition, but it closes one of astrophysics' longest-running bookkeeping gaps.`,
    publishedAt: new Date(REF - 20 * 60 * 60 * 1000).toISOString(),
    marketId: "m17",
  },
  {
    id: "s18",
    topic: "tech",
    title:
      "The app that *pays you to leave your phone in a drawer*",
    summary:
      "A Danish startup is betting that people will pay for the privilege of not using their phones. They've raised $12M to prove it.",
    body: `The premise of Offgrid is simple enough to describe and bizarre enough to fund: you lock your phone in a timed safe, and for every uninterrupted hour, you earn credits redeemable for — of all things — bookstore gift cards, museum tickets, and park passes.

The Copenhagen-based startup raised a $12M Series A last month, led by a16z, and has 140,000 users across Scandinavia. The average user locks their phone for 3.2 hours per session. The most popular locking time is Saturday morning.

The business model is advertising-adjacent but indirect: Offgrid partners with cultural institutions and brands that benefit from analog attention — bookstores, galleries, restaurants that ban phones. These partners fund the credits as a customer acquisition cost.

Founder Mads Kjeldsen, a former product manager at Spotify, describes the company's thesis plainly: "The attention economy created a deficit. We're building the attention savings account."`,
    publishedAt: new Date(REF - 16 * 60 * 60 * 1000).toISOString(),
    marketId: "m18",
  },
  {
    id: "s19",
    topic: "politics",
    title:
      "The bipartisan bill that *nobody is talking about* could reshape rural broadband",
    summary:
      "A quiet infrastructure bill with support from both parties would fund fiber-to-the-home for 15 million Americans. It's stuck in committee.",
    body: `The Rural Connectivity Act of 2026, co-sponsored by a Republican senator from Montana and a Democratic senator from Michigan, would allocate $28 billion over five years to build fiber-optic infrastructure in underserved rural communities. It has 34 co-sponsors. It has near-unanimous support from governors of both parties. It is stuck in the Senate Commerce Committee and no one is sure why.

The bill's approach is unusual: rather than funding ISPs directly, it would create a public-benefit corporation modeled on the Tennessee Valley Authority, tasked with building and maintaining a fiber network that private ISPs could lease access to. The model separates infrastructure ownership from service provision — a distinction that delights policy wonks and confuses everyone else.

Opponents, primarily from large telecom companies, argue the bill would create unfair government competition. Supporters counter that rural broadband deployment by private companies has failed for twenty years.

The bill's best chance of passage may be as an amendment to a larger spending package, but the legislative calendar is running short.`,
    publishedAt: new Date(REF - 26 * 60 * 60 * 1000).toISOString(),
    marketId: "m19",
  },
  {
    id: "s20",
    topic: "economy",
    title:
      "Japan's *reverse brain drain* is accelerating — and Silicon Valley is noticing",
    summary:
      "For the first time, more Japanese tech workers are returning home than leaving. The weak yen is only part of the explanation.",
    body: `In 2025, approximately 12,000 Japanese-born engineers and product managers returned to Japan from positions at American tech companies — double the number from 2023. The trend, which recruiters are calling the "reverse kuroshio," has accelerated further in the first quarter of 2026.

The weak yen is the obvious factor: salaries in Tokyo, already competitive in local currency, now convert favorably when measured against Bay Area cost of living. A senior engineer earning ¥18M in Tokyo has roughly the same purchasing power as one earning $280K in San Francisco, with significantly lower housing costs.

But compensation is only part of the story. Interviews with returning workers reveal a consistent theme: quality of life. Japan's healthcare system, public safety, food quality, and infrastructure repeatedly outrank salary in their decision calculus.

The impact on the Japanese tech ecosystem has been immediate. Tokyo-based startups report that fundraising conversations have shifted: "Two years ago, investors asked why we couldn't hire from the US. Now they ask how many returnees we have," said the CEO of a robotics startup.`,
    publishedAt: new Date(REF - 30 * 60 * 60 * 1000).toISOString(),
    marketId: "m20",
  },
  {
    id: "s21",
    topic: "economy",
    title: "Bitcoin just crossed $68K — and *nobody panicked*",
    summary:
      "For the first time in a bull cycle, a new all-time high was met with institutional calm instead of retail frenzy. Analysts say the market has matured. Skeptics say it's the quiet before something louder.",
    body: `Bitcoin crossed $68,000 on Tuesday afternoon, setting a new all-time high in what might be the least dramatic record-breaking moment in the asset's history. There were no laser eyes on Twitter. No champagne-popping Telegram groups. The price ticked up, held, and the market moved on.

The muted reaction is itself the story. In previous cycles — 2017, 2021 — new highs triggered cascading waves of retail buying, media coverage, and eventually, painful corrections. This time, the buyer base is different: ETF inflows account for roughly 40% of recent volume, and most of that comes from institutional allocators with long time horizons.

"The adults are in the room," said one fund manager at a New York digital asset conference last week. "Whether that's good or bad depends on what you think markets are for."

Critics argue that institutional dominance has stripped Bitcoin of its original ethos — decentralized, grassroots, resistant to capture. Proponents counter that widespread adoption was always the goal, and this is what adoption looks like.`,
    publishedAt: new Date(REF - 4 * 60 * 60 * 1000).toISOString(),
    marketId: "m21",
  },
  {
    id: "s22",
    topic: "tech",
    title: "Ethereum's next upgrade could make *gas fees disappear* for most users",
    summary:
      "A proposal called EIP-7702 would let apps pay transaction fees on behalf of users. If adopted, the average person would never see a gas fee again.",
    body: `For years, the biggest complaint about Ethereum hasn't been speed or security — it's been the moment a new user tries to do something and gets asked to pay a "gas fee" in a currency they don't own, for a reason they don't understand.

EIP-7702, scheduled for inclusion in the next major upgrade, would change that. The proposal allows applications to sponsor transaction fees on behalf of their users — the same way a website pays for its own server costs rather than billing visitors per page load.

The technical mechanism is called "account abstraction," but the user-facing result is simple: you tap a button, the thing happens, and nobody mentions gas. The app absorbs the cost as a line item in its operating budget.

"We've been asking regular people to understand monetary policy before they can use an app," said one of the proposal's authors. "That was always insane."

The proposal has broad support among developers. The debate is over timing and edge cases, not direction. If adopted in the September upgrade, most major Ethereum apps could eliminate visible gas fees by year-end.`,
    publishedAt: new Date(REF - 9 * 60 * 60 * 1000).toISOString(),
    marketId: "m22",
  },
  {
    id: "s23",
    topic: "economy",
    title: "The country that just made *Bitcoin legal tender* — again",
    summary:
      "After El Salvador's rocky experiment, a second nation is trying the same playbook with different safeguards. Economists are cautiously watching.",
    body: `The Kingdom of Bhutan announced last week that Bitcoin would become legal tender alongside the ngultrum, effective August 1. The announcement came with an unusual caveat: citizens would not be required to accept it, and the government would maintain a 60-day price buffer fund to smooth volatility for merchants who do.

Bhutan's approach differs from El Salvador's in several key ways. Where El Salvador mandated acceptance and launched a government wallet, Bhutan is making participation entirely voluntary and partnering with three private payment processors. The buffer fund, seeded with $50 million from the country's sovereign wealth fund, would compensate merchants for price drops within 60 days of a transaction.

Economists are cautiously interested. "The voluntary model with a volatility buffer is genuinely novel," said a researcher at the IMF who was not authorized to speak publicly. "It addresses the two biggest criticisms of the Salvadoran model — coercion and merchant risk."

The move is partly strategic: Bhutan's hydroelectric Bitcoin mining operation, launched quietly in 2023, has accumulated an estimated 13,000 BTC. Making Bitcoin legal tender creates domestic demand for an asset the government already holds.`,
    publishedAt: new Date(REF - 15 * 60 * 60 * 1000).toISOString(),
    marketId: "m23",
  },
  {
    id: "s24",
    topic: "economy",
    title: "Why your *savings account* might soon hold stablecoins — whether you know it or not",
    summary:
      "Three major banks are piloting stablecoin-backed savings products. The interest rates are better. The fine print is fascinating.",
    body: `JPMorgan, ING, and Société Générale are each piloting savings products that hold customer deposits in regulated stablecoins rather than traditional reserves. The products look identical to normal savings accounts from the customer's perspective — same FDIC-equivalent insurance, same online banking interface, same withdrawal rules.

The difference is under the hood: instead of lending deposits to borrowers (the traditional model), the banks invest in short-duration Treasury-backed stablecoins that generate yield directly. The result is a savings rate of 4.8% — roughly double what most banks currently offer.

"The customer doesn't need to know or care that stablecoins are involved," said a JPMorgan executive at a fintech conference in London. "They see a savings account with a better rate. That's it."

Consumer advocates are cautiously supportive but want transparency. "If my savings are backed by a stablecoin, I want to know which one, who audits it, and what happens if it de-pegs," said the director of a consumer finance watchdog.

The pilots are small — roughly 10,000 customers each — but the banks have signaled intent to scale if regulatory approval holds.`,
    publishedAt: new Date(REF - 7 * 60 * 60 * 1000).toISOString(),
    marketId: "m24",
  },
];

// ─── Markets ────────────────────────────────────────────────────────

export const markets: Market[] = [
  {
    id: "m1",
    storyId: "s1",
    question: "Will at least one map pass before August?",
    probabilityYes: 0.63,
    history: generatePriceHistory(0.63),
    resolvesAt: "2026-08-01T00:00:00Z",
  },
  {
    id: "m2",
    storyId: "s2",
    question: "Will it win the National Book Award?",
    probabilityYes: 0.29,
    history: generatePriceHistory(0.29),
    resolvesAt: "2026-11-20T00:00:00Z",
  },
  {
    id: "m3",
    storyId: "s3",
    question: "Will a major lab acqui-hire the team before Q3?",
    probabilityYes: 0.78,
    history: generatePriceHistory(0.78),
    resolvesAt: "2026-09-30T00:00:00Z",
  },
  {
    id: "m4",
    storyId: "s4",
    question: "Will 2026 exceed 14 named storms?",
    probabilityYes: 0.41,
    history: generatePriceHistory(0.41),
    resolvesAt: "2026-11-30T00:00:00Z",
  },
  {
    id: "m5",
    storyId: "s5",
    question: "Will the Fed cut rates before August?",
    probabilityYes: 0.72,
    history: generatePriceHistory(0.72),
    resolvesAt: "2026-08-01T00:00:00Z",
  },
  {
    id: "m6",
    storyId: "s6",
    question: "Will Mekonnen break 2:12 this year?",
    probabilityYes: 0.55,
    history: generatePriceHistory(0.55),
    resolvesAt: "2026-12-31T00:00:00Z",
  },
  {
    id: "m7",
    storyId: "s7",
    question: "Will torellin enter Phase I trials by year-end?",
    probabilityYes: 0.34,
    history: generatePriceHistory(0.34),
    resolvesAt: "2026-12-31T00:00:00Z",
  },
  {
    id: "m8",
    storyId: "s8",
    question: "Will Malta's car ban survive its first year?",
    probabilityYes: 0.61,
    history: generatePriceHistory(0.61),
    resolvesAt: "2027-06-01T00:00:00Z",
  },
  {
    id: "m9",
    storyId: "s9",
    question: "Will 'The Ledger' gross over $20M domestically?",
    probabilityYes: 0.44,
    history: generatePriceHistory(0.44),
    resolvesAt: "2026-12-31T00:00:00Z",
  },
  {
    id: "m10",
    storyId: "s10",
    question: "Will Governor Chen announce a presidential run by September?",
    probabilityYes: 0.82,
    history: generatePriceHistory(0.82),
    resolvesAt: "2026-09-30T00:00:00Z",
  },
  {
    id: "m11",
    storyId: "s11",
    question: "Will a major IoT vulnerability lead to a recall in 2026?",
    probabilityYes: 0.38,
    history: generatePriceHistory(0.38),
    resolvesAt: "2026-12-31T00:00:00Z",
  },
  {
    id: "m12",
    storyId: "s12",
    question: "Will Perito Moreno advance again next year?",
    probabilityYes: 0.52,
    history: generatePriceHistory(0.52),
    resolvesAt: "2027-03-31T00:00:00Z",
  },
  {
    id: "m13",
    storyId: "s13",
    question: "Will US median home prices fall 5%+ by December?",
    probabilityYes: 0.23,
    history: generatePriceHistory(0.23),
    resolvesAt: "2026-12-31T00:00:00Z",
  },
  {
    id: "m14",
    storyId: "s14",
    question: "Will the Museum of Water have over 50,000 visitors this year?",
    probabilityYes: 0.67,
    history: generatePriceHistory(0.67),
    resolvesAt: "2026-12-31T00:00:00Z",
  },
  {
    id: "m15",
    storyId: "s15",
    question: "Will Dubois reach 2750 Elo before turning 15?",
    probabilityYes: 0.48,
    history: generatePriceHistory(0.48),
    resolvesAt: "2027-01-15T00:00:00Z",
  },
  {
    id: "m16",
    storyId: "s16",
    question: "Will Spain adopt a national four-day workweek by 2027?",
    probabilityYes: 0.19,
    history: generatePriceHistory(0.19),
    resolvesAt: "2027-01-01T00:00:00Z",
  },
  {
    id: "m17",
    storyId: "s17",
    question: "Will the missing matter finding be confirmed by a second team?",
    probabilityYes: 0.74,
    history: generatePriceHistory(0.74),
    resolvesAt: "2027-06-30T00:00:00Z",
  },
  {
    id: "m18",
    storyId: "s18",
    question: "Will Offgrid reach 1M users by year-end?",
    probabilityYes: 0.36,
    history: generatePriceHistory(0.36),
    resolvesAt: "2026-12-31T00:00:00Z",
  },
  {
    id: "m19",
    storyId: "s19",
    question: "Will the Rural Connectivity Act pass before midterms?",
    probabilityYes: 0.31,
    history: generatePriceHistory(0.31),
    resolvesAt: "2026-11-05T00:00:00Z",
  },
  {
    id: "m20",
    storyId: "s20",
    question: "Will Japan's tech returnee rate double again in 2027?",
    probabilityYes: 0.57,
    history: generatePriceHistory(0.57),
    resolvesAt: "2027-12-31T00:00:00Z",
  },
  {
    id: "m21",
    storyId: "s21",
    question: "Will Bitcoin hold above $65K through June?",
    probabilityYes: 0.71,
    history: generatePriceHistory(0.71),
    resolvesAt: "2026-06-30T00:00:00Z",
  },
  {
    id: "m22",
    storyId: "s22",
    question: "Will EIP-7702 ship in the September upgrade?",
    probabilityYes: 0.64,
    history: generatePriceHistory(0.64),
    resolvesAt: "2026-09-30T00:00:00Z",
  },
  {
    id: "m23",
    storyId: "s23",
    question: "Will Bhutan's Bitcoin legal tender law survive its first year?",
    probabilityYes: 0.53,
    history: generatePriceHistory(0.53),
    resolvesAt: "2027-08-01T00:00:00Z",
  },
  {
    id: "m24",
    storyId: "s24",
    question: "Will stablecoin savings accounts reach 1M users by year-end?",
    probabilityYes: 0.42,
    history: generatePriceHistory(0.42),
    resolvesAt: "2026-12-31T00:00:00Z",
  },
];

// ─── Lessons ────────────────────────────────────────────────────────

export const lessons: Lesson[] = [
  {
    id: 1,
    romanNumeral: "I",
    title: "What's a prediction market, really?",
    subtitle:
      "Not a bet. A way of turning your opinion into something you can measure.",
    body: `A prediction market is a place where people put money behind what they think will happen. If you think something is more likely than the current price suggests, you buy. If you're right, you profit. If you're wrong, you lose what you put in.

The price in a prediction market represents the crowd's collective belief about an event's probability. When you see "63%," it means the market — all the people with money on the line — collectively believes there's a 63% chance this event will happen.

What makes prediction markets different from polls or pundit opinions is accountability. It's easy to say you think something will happen. It's harder to put a dollar on it. That accountability tends to make the signal more honest.`,
    unlockAfterPredictions: 0,
  },
  {
    id: 2,
    romanNumeral: "II",
    title: "Where does your money go?",
    subtitle:
      'A short tour of what happens between "back this" and "cash out."',
    body: `When you back a hunch, your money goes into a shared pool for that market. You're essentially buying a position — a claim that pays out if the event resolves in your favor.

If you buy "Yes" at 63%, you're paying $0.63 for a contract that pays $1.00 if the answer turns out to be yes. Your potential profit is $0.37. If the answer is no, you lose your $0.63.

The price moves as other people buy and sell. If more people agree with you, the price goes up (and your position becomes worth more, even before the event resolves). If people disagree, the price drops.

When the event happens — or doesn't — the market "resolves." Winners get paid. The whole process is automatic.`,
    unlockAfterPredictions: 0,
  },
  {
    id: 3,
    romanNumeral: "III",
    title: "What's a stablecoin?",
    subtitle: "The quiet thing your balance is already made of.",
    body: `Your balance in this app is stored in something called a stablecoin — a digital dollar that's designed to always be worth exactly $1.00. You don't need to think about this; it works like regular money from your perspective.

The reason we use stablecoins instead of regular bank dollars is speed and flexibility. Stablecoin transactions settle in seconds, work globally, and don't require a traditional bank to process. This means your predictions can resolve and pay out almost instantly.

The specific stablecoin we use is backed 1:1 by US dollars held in reserve. For every digital dollar in the system, there's a real dollar sitting in an audited bank account. It's not volatile like Bitcoin or Ethereum. It's just... a dollar, in digital form.`,
    unlockAfterPredictions: 0,
  },
  {
    id: 4,
    romanNumeral: "IV",
    title: "Who decides if you were right?",
    subtitle:
      "Oracles, resolvers, and the surprisingly human part of all this.",
    body: `Every prediction market needs someone — or something — to determine the outcome. Did the event happen or not? This role is called an "oracle" or "resolver."

For most markets, resolution is straightforward: an official source confirms the outcome. Did the bill pass? Check the congressional record. Did the team win? Check the score. The resolver verifies the source and triggers the payout.

Some markets are trickier. "Will this technology be widely adopted?" requires judgment. For these, we use a combination of predefined criteria (set when the market is created) and independent resolvers who evaluate the evidence.

The system is designed to be transparent: you can always see how a market will be resolved before you put money on it.`,
    unlockAfterPredictions: 5,
  },
  {
    id: 5,
    romanNumeral: "V",
    title: "What's a wallet, and why don't you see yours?",
    subtitle:
      "It's been there since day one. Here's why we kept it hidden.",
    body: `You've had a digital wallet since the moment you created your account. It holds your balance, records your positions, and processes your payouts. You just haven't needed to see it.

We hide the wallet because, for most people, it's plumbing. You don't think about HTTP when you browse the web. You shouldn't have to think about wallets when you back a hunch.

Your wallet is secured by your account credentials. We hold a copy of the key on your behalf, which means you can recover access if you lose your phone. The trade-off is trust: you're trusting us to manage your key responsibly, the same way you trust a bank to hold your money.

When you're ready — and only if you want to — you can "graduate" to managing your own key. That's what self-custody means. But there's no rush.`,
    unlockAfterPredictions: 7,
  },
  {
    id: 6,
    romanNumeral: "VI",
    title: "The blockchain, in under a minute.",
    subtitle: "No mysticism. No Bitcoin sermon. Just how the plumbing works.",
    body: `A blockchain is a shared ledger that nobody owns. Every transaction — every bet placed, every payout made — is recorded on it. The record can't be altered after the fact.

Think of it like a public notary that works automatically. When you back a hunch, the transaction is written to this ledger. When the market resolves, the payout is recorded there too. Anyone can verify that the system is working fairly.

You don't interact with the blockchain directly. The app handles it behind the scenes. But it's the reason you don't have to take our word for it when we say the system is fair — the math is verifiable by anyone who wants to check.

That's it. No ideology. No revolution. Just a useful piece of infrastructure that makes trust less necessary.`,
    unlockAfterPredictions: 9,
  },
  {
    id: 7,
    romanNumeral: "VII",
    title: "When would you want to graduate to self-custody?",
    subtitle:
      "You might not. And that's fine. Here's how to decide.",
    body: `Self-custody means taking control of your own wallet key — the cryptographic password that proves you own your funds. Right now, we hold that key on your behalf. If you graduate, you hold it yourself.

The advantage is independence: no one — not us, not anyone — can freeze your account or block your transactions. The downside is responsibility: if you lose the key, there's no "forgot password" button. It's gone.

Most people don't need self-custody. If you're using the app to back hunches and track your record, our custodial system works fine. Self-custody makes sense if you want to move larger amounts, use your funds across multiple platforms, or simply prefer not to trust a third party.

There's no pressure either way. When you're ready — if you're ever ready — the option is there.`,
    unlockAfterPredictions: 10,
  },
];

// ─── Resolved positions (for track record) ─────────────────────────

const resolvedPositions: ResolvedPosition[] = [
  {
    marketId: "m3",
    side: "yes",
    amount: 5,
    takenAt: "2026-03-15T10:00:00Z",
    currentValue: 7.12,
    resolvedAt: "2026-04-10T00:00:00Z",
    correct: true,
    payout: 7.12,
  },
  {
    marketId: "m5-old",
    side: "yes",
    amount: 1,
    takenAt: "2026-03-20T14:00:00Z",
    currentValue: 0,
    resolvedAt: "2026-04-08T00:00:00Z",
    correct: false,
    payout: 0,
  },
  {
    marketId: "m9-old",
    side: "yes",
    amount: 1,
    takenAt: "2026-03-10T09:00:00Z",
    currentValue: 1.43,
    resolvedAt: "2026-04-02T00:00:00Z",
    correct: true,
    payout: 1.43,
  },
  {
    marketId: "m-uk-inflation",
    side: "yes",
    amount: 1,
    takenAt: "2026-02-15T11:00:00Z",
    currentValue: 1.67,
    resolvedAt: "2026-03-28T00:00:00Z",
    correct: true,
    payout: 1.67,
  },
  {
    marketId: "m-apple-ar",
    side: "yes",
    amount: 5,
    takenAt: "2026-02-20T16:00:00Z",
    currentValue: 0,
    resolvedAt: "2026-03-20T00:00:00Z",
    correct: false,
    payout: 0,
  },
];

// Track record display data (enriched for UI)
export const resolvedMarketQuestions: Record<string, string> = {
  m3: "Warsaw team acqui-hired before Q3",
  "m5-old": "Fed cuts rates by April 15",
  "m9-old": "Oscars Best Picture: The Long Hallway",
  "m-uk-inflation": "UK inflation below 3% in Q1",
  "m-apple-ar": "Apple announces AR glasses at WWDC",
};

// ─── Initial user ───────────────────────────────────────────────────

export const initialUser: User = {
  name: "Armando",
  practiceBalance: 10.0,
  positions: [
    {
      marketId: "m1",
      side: "yes",
      amount: 1,
      takenAt: "2026-04-12T10:00:00Z",
      currentValue: 1.18,
    },
    {
      marketId: "m3",
      side: "yes",
      amount: 5,
      takenAt: "2026-04-10T14:00:00Z",
      currentValue: 7.12,
    },
    {
      marketId: "m2",
      side: "no",
      amount: 1,
      takenAt: "2026-04-11T09:00:00Z",
      currentValue: 1.04,
    },
    {
      marketId: "m4",
      side: "no",
      amount: 1,
      takenAt: "2026-04-09T16:00:00Z",
      currentValue: 0.91,
    },
  ],
  resolvedPositions,
  predictionsCompleted: 3,
  accuracyRate: 0.62,
  unlockedLessons: [1, 2, 3],
  selectedTopics: ["politics", "tech", "culture"],
  onboardingComplete: false,
};
