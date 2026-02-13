
import { getStore } from "@netlify/blobs";
import type { Handler } from "@netlify/functions";

// Initial seed data moved from App.tsx
const SEED_DATA = [
    { id: '1', name: 'Scott Swift', email: 'scott.l.swift@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '2', name: 'Aidensdad26@yahoo.com', email: 'Aidensdad26@yahoo.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '3', name: 'Aleks Trifunovic', email: 'atrifunovic@leewestla.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '4', name: 'Andre Beverly', email: '2heymon@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '5', name: 'Bigoscar22@gmail.com', email: 'Bigoscar22@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '6', name: 'Dan_briggs23@yahoo.com', email: 'Dan_briggs23@yahoo.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '7', name: 'Donshimo@gmail.com', email: 'Donshimo@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '8', name: 'Gary.Harrigian@wellsfargo.com', email: 'Gary.Harrigian@wellsfargo.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '9', name: 'James@teamstein.com', email: 'James@teamstein.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '10', name: 'Jason Choi', email: 'thebestfavorite1@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '11', name: 'Jdstorm1@yahoo.com', email: 'Jdstorm1@yahoo.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '12', name: 'Johnny3bikes@verizon.net', email: 'Johnny3bikes@verizon.net', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '13', name: 'Kip Theno', email: 'kip_theno@yahoo.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '14', name: 'Kolin Watts', email: 'kolinwatts@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '15', name: 'Lappo2@aol.com', email: 'Lappo2@aol.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '16', name: 'Lindsay.costello9@gmail.com', email: 'Lindsay.costello9@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '17', name: 'Mavis6091@aol.com', email: 'Mavis6091@aol.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '18', name: 'Mischa.rytz@gmail.com', email: 'Mischa.rytz@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '19', name: 'NRosik@yahoo.com', email: 'NRosik@yahoo.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '20', name: 'PEDDLERDLX@gmail.com', email: 'PEDDLERDLX@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '21', name: 'Paul Magaletta', email: 'pmagaletta71@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '22', name: 'Pmcfedries@hotmail.com', email: 'Pmcfedries@hotmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '23', name: 'Vitavat Buranabul', email: 'vitob01@yahoo.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '24', name: 'Willchessum@msn.com', email: 'Willchessum@msn.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '25', name: 'abretana@yahoo.com', email: 'abretana@yahoo.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '26', name: 'adamj1242@me.com', email: 'adamj1242@me.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '27', name: 'awlennox88@gmail.com', email: 'awlennox88@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '28', name: 'beachcitiesdui@gmail.com', email: 'beachcitiesdui@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '29', name: 'bhdavidson77@gmail.com', email: 'bhdavidson77@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '30', name: 'bjwyr5@gmail.com', email: 'bjwyr5@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '31', name: 'blakeoner@gmail.com', email: 'blakeoner@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '32', name: 'bradley_helms@icloud.com', email: 'bradley_helms@icloud.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '33', name: 'brian.babb.2008@gmail.com', email: 'brian.babb.2008@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '34', name: 'brunoperron@sbcglobal.net', email: 'brunoperron@sbcglobal.net', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '35', name: 'californiafalcons@icloud.com', email: 'californiafalcons@icloud.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '36', name: 'carey.elliott@yahoo.com', email: 'carey.elliott@yahoo.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '37', name: 'ciardellia@gmail.com', email: 'ciardellia@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '38', name: 'dldawson77@gmail.com', email: 'dldawson77@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '39', name: 'dnash16@me.com', email: 'dnash16@me.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '40', name: 'donaldshort21@gmail.com', email: 'donaldshort21@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '41', name: 'garyharrigian@gmail.com', email: 'garyharrigian@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '42', name: 'glenn.hutchinson@gmail.com', email: 'glenn.hutchinson@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '43', name: 'hattrik88@hotmail.com', email: 'hattrik88@hotmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '44', name: 'hawvikins@sbcglobal.net', email: 'hawvikins@sbcglobal.net', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '45', name: 'hockeycoachjoe@gmail.com', email: 'hockeycoachjoe@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '46', name: 'jake.turelli@gmail.com', email: 'jake.turelli@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '47', name: 'jamesdolen@mac.com', email: 'jamesdolen@mac.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '48', name: 'jaredHeins9@yahoo.com', email: 'jaredHeins9@yahoo.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '49', name: 'jay@got-bag.com', email: 'jay@got-bag.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '50', name: 'jcaf210@gmail.com', email: 'jcaf210@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '51', name: 'jeffroor22@gmail.com', email: 'jeffroor22@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '52', name: 'jim_mastandrea@yahoo.com', email: 'jim_mastandrea@yahoo.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '53', name: 'jobforacapon@gmail.com', email: 'jobforacapon@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '54', name: 'joseflores8282@att.net', email: 'joseflores8282@att.net', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '55', name: 'josh.abrams@gmail.com', email: 'josh.abrams@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '56', name: 'justindrod27@gmail.com', email: 'justindrod27@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '57', name: 'kaufman56@gmail.com', email: 'kaufman56@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '58', name: 'kevdawg59@gmail.com', email: 'kevdawg59@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '59', name: 'kevin@iperiscope.com', email: 'kevin@iperiscope.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '60', name: 'kingbear02@gmail.com', email: 'kingbear02@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '61', name: 'knerdhouse4@gmail.com', email: 'knerdhouse4@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '62', name: 'laquer18@aol.com', email: 'laquer18@aol.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '63', name: 'lyonreese247@gmail.com', email: 'lyonreese247@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '64', name: 'markaltamirano@gmail.com', email: 'markaltamirano@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '65', name: 'mattboles13@hotmail.com', email: 'mattboles13@hotmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '66', name: 'mattmahood@yahoo.com', email: 'mattmahood@yahoo.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '67', name: 'mattypro37@yahoo.com', email: 'mattypro37@yahoo.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '68', name: 'mfurillo@aol.com', email: 'mfurillo@aol.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '69', name: 'michael.c.preiss@gmail.com', email: 'michael.c.preiss@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '70', name: 'michaeltootle@gmail.com', email: 'michaeltootle@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '71', name: 'mickgaglia@yahoo.com', email: 'mickgaglia@yahoo.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '72', name: 'mjandra44@gmail.com', email: 'mjandra44@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '73', name: 'monkeytime5d@gmail.com', email: 'monkeytime5d@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '74', name: 'mtcooplb49er@gmail.com', email: 'mtcooplb49er@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '75', name: 'p.reuter8@yahoo.com', email: 'p.reuter8@yahoo.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '76', name: 'pb247@icloud.com', email: 'pb247@icloud.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '77', name: 'phillip_keith@hotmail.com', email: 'phillip_keith@hotmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '78', name: 'repjaysheldon@gmail.com', email: 'repjaysheldon@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '79', name: 'richard@lakai.com', email: 'richard@lakai.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '80', name: 'rjwilliamsjd87@hushmail.com', email: 'rjwilliamsjd87@hushmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '81', name: 'roadraper@yahoo.com', email: 'roadraper@yahoo.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '82', name: 'robblu10@hotmail.com', email: 'robblu10@hotmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '83', name: 'robert.norrito@yahoo.com', email: 'robert.norrito@yahoo.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '84', name: 'roycal5@gmail.com', email: 'roycal5@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '85', name: 'Roy Remsburg', email: 'rremsburg@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '86', name: 'sjbisogni@gmail.com', email: 'sjbisogni@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '87', name: 'socalproposal@gmail.com', email: 'socalproposal@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '88', name: 'stcscott1@gmail.com', email: 'stcscott1@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '89', name: 'vancouver8@aol.com', email: 'vancouver8@aol.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '90', name: 'vbarbarie@gmail.com', email: 'vbarbarie@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '91', name: 'nickreader8@gmail.com', email: 'nickreader8@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '92', name: 'Ubaevan@gmail.com', email: 'Ubaevan@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '93', name: 'j.w.ryan3@gmail.com', email: 'j.w.ryan3@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '94', name: 'csmanis@cox.net', email: 'csmanis@cox.net', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '95', name: 'joe@joebrundige.com', email: 'joe@joebrundige.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '96', name: 'Kdubble4@gmail.com', email: 'Kdubble4@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '97', name: 'richardgomez52@gmail.com', email: 'richardgomez52@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '98', name: 'ipoint@roadrunner.com', email: 'ipoint@roadrunner.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '99', name: 'Mike Malinowski', email: 'mikemalinowski9@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '100', name: 'thevoltvault@proton.me', email: 'thevoltvault@proton.me', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '101', name: 'ericwhitelock@outlook.com', email: 'ericwhitelock@outlook.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '102', name: 'petelucas399@yahoo.com', email: 'petelucas399@yahoo.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '103', name: 'Andrew Neal', email: 'a.neal7@yahoo.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '104', name: 'Jason Withee', email: 'jasonrwithee@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '105', name: 'kevin.ferrara@gmail.com', email: 'kevin.ferrara@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '106', name: 'Clapper.shane@gmail.com', email: 'Clapper.shane@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '107', name: 'Tycarx@me.com', email: 'Tycarx@me.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '108', name: 'brentmchenry@gmail.com', email: 'brentmchenry@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '109', name: 'jonasherdesign@gmail.com', email: 'jonasherdesign@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '110', name: 'Ian D', email: 'ian.davis1w@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '111', name: 'justinmedeiros74@yahoo.com', email: 'justinmedeiros74@yahoo.com', position: 'Forward', skillLevel: 5, status: 'PENDING' },
    { id: '112', name: 'brandanortega@gmail.com', email: 'brandanortega@gmail.com', position: 'Forward', skillLevel: 5, status: 'PENDING' }
].map(p => ({
    ...p,
    role: 'Regular',
    feesPaid: false
}));

export const handler: Handler = async (event, context) => {
    try {
        // Use 'roster' store to persist player data
        const store = getStore("roster");
        if (event.httpMethod === "GET") {
            let data = await store.get("players", { type: "json" });

            // Auto-seed if the blob is empty (Initial Migration)
            if (!data || (Array.isArray(data) && data.length === 0)) {
                console.log("Blob is empty, seeding with initial data...");
                await store.setJSON("players", SEED_DATA);
                data = SEED_DATA;
            }

            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            };
        }

        if (event.httpMethod === "POST") {
            // Basic security: require a valid JSON body
            if (!event.body) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: "Missing body" }),
                };
            }

            const players = JSON.parse(event.body);

            // Save to blob store
            await store.setJSON("players", players);

            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ success: true }),
            };
        }

        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method Not Allowed" }),
        };
    } catch (error: any) {
        console.error("Blob operation failed:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: `Blob Operation Failed: ${error.message || 'Unknown Error'}`,
                details: "Make sure Netlify Blobs is enabled in your Site Settings on the Netlify Dashboard."
            }),
        };
    }
};
