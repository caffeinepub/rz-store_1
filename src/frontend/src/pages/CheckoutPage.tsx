import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building2,
  CheckCircle,
  CreditCard,
  Edit2,
  Loader2,
  MapPin,
  Navigation,
  ShoppingBag,
  Smartphone,
  Wallet,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAddToCart,
  useCart,
  usePlaceOrder,
  useProducts,
} from "../hooks/useQueries";

/* ============================================================
   INDIA STATES + DISTRICTS DATA
   ============================================================ */
const INDIA_STATES_DISTRICTS: Record<string, string[]> = {
  "Andhra Pradesh": [
    "Anantapur",
    "Chittoor",
    "East Godavari",
    "Guntur",
    "Krishna",
    "Kurnool",
    "Nellore",
    "Prakasam",
    "Srikakulam",
    "Visakhapatnam",
    "Vizianagaram",
    "West Godavari",
    "YSR Kadapa",
  ],
  "Arunachal Pradesh": [
    "Anjaw",
    "Changlang",
    "Dibang Valley",
    "East Kameng",
    "East Siang",
    "Kra Daadi",
    "Kurung Kumey",
    "Lohit",
    "Longding",
    "Lower Dibang Valley",
    "Lower Siang",
    "Lower Subansiri",
    "Namsai",
    "Papum Pare",
    "Siang",
    "Tawang",
    "Tirap",
    "Upper Siang",
    "Upper Subansiri",
    "West Kameng",
    "West Siang",
  ],
  Assam: [
    "Baksa",
    "Barpeta",
    "Biswanath",
    "Bongaigaon",
    "Cachar",
    "Charaideo",
    "Chirang",
    "Darrang",
    "Dhemaji",
    "Dhubri",
    "Dibrugarh",
    "Dima Hasao",
    "Goalpara",
    "Golaghat",
    "Hailakandi",
    "Hojai",
    "Jorhat",
    "Kamrup",
    "Kamrup Metropolitan",
    "Karbi Anglong",
    "Karimganj",
    "Kokrajhar",
    "Lakhimpur",
    "Majuli",
    "Morigaon",
    "Nagaon",
    "Nalbari",
    "Sivasagar",
    "Sonitpur",
    "South Salmara-Mankachar",
    "Tinsukia",
    "Udalguri",
    "West Karbi Anglong",
  ],
  Bihar: [
    "Araria",
    "Arwal",
    "Aurangabad",
    "Banka",
    "Begusarai",
    "Bhagalpur",
    "Bhojpur",
    "Buxar",
    "Darbhanga",
    "East Champaran",
    "Gaya",
    "Gopalganj",
    "Jamui",
    "Jehanabad",
    "Kaimur",
    "Katihar",
    "Khagaria",
    "Kishanganj",
    "Lakhisarai",
    "Madhepura",
    "Madhubani",
    "Munger",
    "Muzaffarpur",
    "Nalanda",
    "Nawada",
    "Patna",
    "Purnia",
    "Rohtas",
    "Saharsa",
    "Samastipur",
    "Saran",
    "Sheikhpura",
    "Sheohar",
    "Sitamarhi",
    "Siwan",
    "Supaul",
    "Vaishali",
    "West Champaran",
  ],
  Chhattisgarh: [
    "Balod",
    "Baloda Bazar",
    "Balrampur",
    "Bastar",
    "Bemetara",
    "Bijapur",
    "Bilaspur",
    "Dantewada",
    "Dhamtari",
    "Durg",
    "Gariaband",
    "Janjgir-Champa",
    "Jashpur",
    "Kabirdham",
    "Kanker",
    "Kondagaon",
    "Korba",
    "Koriya",
    "Mahasamund",
    "Mungeli",
    "Narayanpur",
    "Raigarh",
    "Raipur",
    "Rajnandgaon",
    "Sukma",
    "Surajpur",
    "Surguja",
  ],
  Goa: ["North Goa", "South Goa"],
  Gujarat: [
    "Ahmedabad",
    "Amreli",
    "Anand",
    "Aravalli",
    "Banaskantha",
    "Bharuch",
    "Bhavnagar",
    "Botad",
    "Chhota Udaipur",
    "Dahod",
    "Dang",
    "Devbhoomi Dwarka",
    "Gandhinagar",
    "Gir Somnath",
    "Jamnagar",
    "Junagadh",
    "Kheda",
    "Kutch",
    "Mahisagar",
    "Mehsana",
    "Morbi",
    "Narmada",
    "Navsari",
    "Panchmahal",
    "Patan",
    "Porbandar",
    "Rajkot",
    "Sabarkantha",
    "Surat",
    "Surendranagar",
    "Tapi",
    "Vadodara",
    "Valsad",
  ],
  Haryana: [
    "Ambala",
    "Bhiwani",
    "Charkhi Dadri",
    "Faridabad",
    "Fatehabad",
    "Gurugram",
    "Hisar",
    "Jhajjar",
    "Jind",
    "Kaithal",
    "Karnal",
    "Kurukshetra",
    "Mahendragarh",
    "Nuh",
    "Palwal",
    "Panchkula",
    "Panipat",
    "Rewari",
    "Rohtak",
    "Sirsa",
    "Sonipat",
    "Yamunanagar",
  ],
  "Himachal Pradesh": [
    "Bilaspur",
    "Chamba",
    "Hamirpur",
    "Kangra",
    "Kinnaur",
    "Kullu",
    "Lahaul and Spiti",
    "Mandi",
    "Shimla",
    "Sirmaur",
    "Solan",
    "Una",
  ],
  Jharkhand: [
    "Bokaro",
    "Chatra",
    "Deoghar",
    "Dhanbad",
    "Dumka",
    "East Singhbhum",
    "Garhwa",
    "Giridih",
    "Godda",
    "Gumla",
    "Hazaribagh",
    "Jamtara",
    "Khunti",
    "Koderma",
    "Latehar",
    "Lohardaga",
    "Pakur",
    "Palamu",
    "Ramgarh",
    "Ranchi",
    "Sahibganj",
    "Seraikela Kharsawan",
    "Simdega",
    "West Singhbhum",
  ],
  Karnataka: [
    "Bagalkot",
    "Ballari",
    "Belagavi",
    "Bengaluru Rural",
    "Bengaluru Urban",
    "Bidar",
    "Chamarajanagar",
    "Chikballapur",
    "Chikkamagaluru",
    "Chitradurga",
    "Dakshina Kannada",
    "Davanagere",
    "Dharwad",
    "Gadag",
    "Hassan",
    "Haveri",
    "Kalaburagi",
    "Kodagu",
    "Kolar",
    "Koppal",
    "Mandya",
    "Mysuru",
    "Raichur",
    "Ramanagara",
    "Shivamogga",
    "Tumakuru",
    "Udupi",
    "Uttara Kannada",
    "Vijayapura",
    "Yadgir",
  ],
  Kerala: [
    "Alappuzha",
    "Ernakulam",
    "Idukki",
    "Kannur",
    "Kasaragod",
    "Kollam",
    "Kottayam",
    "Kozhikode",
    "Malappuram",
    "Palakkad",
    "Pathanamthitta",
    "Thiruvananthapuram",
    "Thrissur",
    "Wayanad",
  ],
  "Madhya Pradesh": [
    "Agar Malwa",
    "Alirajpur",
    "Anuppur",
    "Ashoknagar",
    "Balaghat",
    "Barwani",
    "Betul",
    "Bhind",
    "Bhopal",
    "Burhanpur",
    "Chhatarpur",
    "Chhindwara",
    "Damoh",
    "Datia",
    "Dewas",
    "Dhar",
    "Dindori",
    "Guna",
    "Gwalior",
    "Harda",
    "Hoshangabad",
    "Indore",
    "Jabalpur",
    "Jhabua",
    "Katni",
    "Khandwa",
    "Khargone",
    "Mandla",
    "Mandsaur",
    "Morena",
    "Narsinghpur",
    "Neemuch",
    "Panna",
    "Raisen",
    "Rajgarh",
    "Ratlam",
    "Rewa",
    "Sagar",
    "Satna",
    "Sehore",
    "Seoni",
    "Shahdol",
    "Shajapur",
    "Sheopur",
    "Shivpuri",
    "Sidhi",
    "Singrauli",
    "Tikamgarh",
    "Ujjain",
    "Umaria",
    "Vidisha",
  ],
  Maharashtra: [
    "Ahmednagar",
    "Akola",
    "Amravati",
    "Aurangabad",
    "Beed",
    "Bhandara",
    "Buldhana",
    "Chandrapur",
    "Dhule",
    "Gadchiroli",
    "Gondia",
    "Hingoli",
    "Jalgaon",
    "Jalna",
    "Kolhapur",
    "Latur",
    "Mumbai City",
    "Mumbai Suburban",
    "Nagpur",
    "Nanded",
    "Nandurbar",
    "Nashik",
    "Osmanabad",
    "Palghar",
    "Parbhani",
    "Pune",
    "Raigad",
    "Ratnagiri",
    "Sangli",
    "Satara",
    "Sindhudurg",
    "Solapur",
    "Thane",
    "Wardha",
    "Washim",
    "Yavatmal",
  ],
  Manipur: [
    "Bishnupur",
    "Chandel",
    "Churachandpur",
    "Imphal East",
    "Imphal West",
    "Jiribam",
    "Kakching",
    "Kamjong",
    "Kangpokpi",
    "Noney",
    "Pherzawl",
    "Senapati",
    "Tamenglong",
    "Tengnoupal",
    "Thoubal",
    "Ukhrul",
  ],
  Meghalaya: [
    "East Garo Hills",
    "East Jaintia Hills",
    "East Khasi Hills",
    "North Garo Hills",
    "Ri Bhoi",
    "South Garo Hills",
    "South West Garo Hills",
    "South West Khasi Hills",
    "West Garo Hills",
    "West Jaintia Hills",
    "West Khasi Hills",
  ],
  Mizoram: [
    "Aizawl",
    "Champhai",
    "Hnahthial",
    "Khawzawl",
    "Kolasib",
    "Lawngtlai",
    "Lunglei",
    "Mamit",
    "Saiha",
    "Saitual",
    "Serchhip",
  ],
  Nagaland: [
    "Dimapur",
    "Kiphire",
    "Kohima",
    "Longleng",
    "Mokokchung",
    "Mon",
    "Noklak",
    "Peren",
    "Phek",
    "Tuensang",
    "Wokha",
    "Zunheboto",
  ],
  Odisha: [
    "Angul",
    "Balangir",
    "Balasore",
    "Bargarh",
    "Bhadrak",
    "Boudh",
    "Cuttack",
    "Deogarh",
    "Dhenkanal",
    "Gajapati",
    "Ganjam",
    "Jagatsinghpur",
    "Jajpur",
    "Jharsuguda",
    "Kalahandi",
    "Kandhamal",
    "Kendrapara",
    "Kendujhar",
    "Khordha",
    "Koraput",
    "Malkangiri",
    "Mayurbhanj",
    "Nabarangpur",
    "Nayagarh",
    "Nuapada",
    "Puri",
    "Rayagada",
    "Sambalpur",
    "Sonepur",
    "Sundargarh",
  ],
  Punjab: [
    "Amritsar",
    "Barnala",
    "Bathinda",
    "Faridkot",
    "Fatehgarh Sahib",
    "Fazilka",
    "Ferozepur",
    "Gurdaspur",
    "Hoshiarpur",
    "Jalandhar",
    "Kapurthala",
    "Ludhiana",
    "Mansa",
    "Moga",
    "Mohali",
    "Muktsar",
    "Pathankot",
    "Patiala",
    "Rupnagar",
    "Sangrur",
    "Shahid Bhagat Singh Nagar",
    "Tarn Taran",
  ],
  Rajasthan: [
    "Ajmer",
    "Alwar",
    "Banswara",
    "Baran",
    "Barmer",
    "Bharatpur",
    "Bhilwara",
    "Bikaner",
    "Bundi",
    "Chittorgarh",
    "Churu",
    "Dausa",
    "Dholpur",
    "Dungarpur",
    "Hanumangarh",
    "Jaipur",
    "Jaisalmer",
    "Jalore",
    "Jhalawar",
    "Jhunjhunu",
    "Jodhpur",
    "Karauli",
    "Kota",
    "Nagaur",
    "Pali",
    "Pratapgarh",
    "Rajsamand",
    "Sawai Madhopur",
    "Sikar",
    "Sirohi",
    "Sri Ganganagar",
    "Tonk",
    "Udaipur",
  ],
  Sikkim: [
    "East Sikkim",
    "North Sikkim",
    "Pakyong",
    "Soreng",
    "South Sikkim",
    "West Sikkim",
  ],
  "Tamil Nadu": [
    "Ariyalur",
    "Chengalpattu",
    "Chennai",
    "Coimbatore",
    "Cuddalore",
    "Dharmapuri",
    "Dindigul",
    "Erode",
    "Kallakurichi",
    "Kancheepuram",
    "Kanyakumari",
    "Karur",
    "Krishnagiri",
    "Madurai",
    "Mayiladuthurai",
    "Nagapattinam",
    "Namakkal",
    "Nilgiris",
    "Perambalur",
    "Pudukkottai",
    "Ramanathapuram",
    "Ranipet",
    "Salem",
    "Sivaganga",
    "Tenkasi",
    "Thanjavur",
    "Theni",
    "Thoothukudi",
    "Tiruchirappalli",
    "Tirunelveli",
    "Tirupathur",
    "Tiruppur",
    "Tiruvallur",
    "Tiruvannamalai",
    "Tiruvarur",
    "Vellore",
    "Viluppuram",
    "Virudhunagar",
  ],
  Telangana: [
    "Adilabad",
    "Bhadradri Kothagudem",
    "Hyderabad",
    "Jagtial",
    "Jangaon",
    "Jayashankar Bhupalpally",
    "Jogulamba Gadwal",
    "Kamareddy",
    "Karimnagar",
    "Khammam",
    "Kumuram Bheem",
    "Mahabubabad",
    "Mahabubnagar",
    "Mancherial",
    "Medak",
    "Medchal-Malkajgiri",
    "Mulugu",
    "Nagarkurnool",
    "Nalgonda",
    "Narayanpet",
    "Nirmal",
    "Nizamabad",
    "Peddapalli",
    "Rajanna Sircilla",
    "Rangareddy",
    "Sangareddy",
    "Siddipet",
    "Suryapet",
    "Vikarabad",
    "Wanaparthy",
    "Warangal Rural",
    "Warangal Urban",
    "Yadadri Bhuvanagiri",
  ],
  Tripura: [
    "Dhalai",
    "Gomati",
    "Khowai",
    "North Tripura",
    "Sepahijala",
    "South Tripura",
    "Unakoti",
    "West Tripura",
  ],
  "Uttar Pradesh": [
    "Agra",
    "Aligarh",
    "Ambedkar Nagar",
    "Amethi",
    "Amroha",
    "Auraiya",
    "Ayodhya",
    "Azamgarh",
    "Baghpat",
    "Bahraich",
    "Ballia",
    "Balrampur",
    "Banda",
    "Barabanki",
    "Bareilly",
    "Basti",
    "Bhadohi",
    "Bijnor",
    "Budaun",
    "Bulandshahr",
    "Chandauli",
    "Chitrakoot",
    "Deoria",
    "Etah",
    "Etawah",
    "Farrukhabad",
    "Fatehpur",
    "Firozabad",
    "Gautam Buddha Nagar",
    "Ghaziabad",
    "Ghazipur",
    "Gonda",
    "Gorakhpur",
    "Hamirpur",
    "Hapur",
    "Hardoi",
    "Hathras",
    "Jalaun",
    "Jaunpur",
    "Jhansi",
    "Kannauj",
    "Kanpur Dehat",
    "Kanpur Nagar",
    "Kasganj",
    "Kaushambi",
    "Kushinagar",
    "Lakhimpur Kheri",
    "Lalitpur",
    "Lucknow",
    "Maharajganj",
    "Mahoba",
    "Mainpuri",
    "Mathura",
    "Mau",
    "Meerut",
    "Mirzapur",
    "Moradabad",
    "Muzaffarnagar",
    "Pilibhit",
    "Pratapgarh",
    "Prayagraj",
    "Raebareli",
    "Rampur",
    "Saharanpur",
    "Sambhal",
    "Sant Kabir Nagar",
    "Shahjahanpur",
    "Shamli",
    "Shravasti",
    "Siddharthnagar",
    "Sitapur",
    "Sonbhadra",
    "Sultanpur",
    "Unnao",
    "Varanasi",
  ],
  Uttarakhand: [
    "Almora",
    "Bageshwar",
    "Chamoli",
    "Champawat",
    "Dehradun",
    "Haridwar",
    "Nainital",
    "Pauri Garhwal",
    "Pithoragarh",
    "Rudraprayag",
    "Tehri Garhwal",
    "Udham Singh Nagar",
    "Uttarkashi",
  ],
  "West Bengal": [
    "Alipurduar",
    "Bankura",
    "Birbhum",
    "Cooch Behar",
    "Dakshin Dinajpur",
    "Darjeeling",
    "Hooghly",
    "Howrah",
    "Jalpaiguri",
    "Jhargram",
    "Kalimpong",
    "Kolkata",
    "Malda",
    "Murshidabad",
    "Nadia",
    "North 24 Parganas",
    "Paschim Bardhaman",
    "Paschim Medinipur",
    "Purba Bardhaman",
    "Purba Medinipur",
    "Purulia",
    "South 24 Parganas",
    "Uttar Dinajpur",
  ],
  "Andaman and Nicobar Islands": [
    "Nicobar",
    "North and Middle Andaman",
    "South Andaman",
  ],
  Chandigarh: ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": [
    "Dadra and Nagar Haveli",
    "Daman",
    "Diu",
  ],
  Delhi: [
    "Central Delhi",
    "East Delhi",
    "New Delhi",
    "North Delhi",
    "North East Delhi",
    "North West Delhi",
    "Shahdara",
    "South Delhi",
    "South East Delhi",
    "South West Delhi",
    "West Delhi",
  ],
  "Jammu and Kashmir": [
    "Anantnag",
    "Bandipora",
    "Baramulla",
    "Budgam",
    "Doda",
    "Ganderbal",
    "Jammu",
    "Kathua",
    "Kishtwar",
    "Kulgam",
    "Kupwara",
    "Poonch",
    "Pulwama",
    "Rajouri",
    "Ramban",
    "Reasi",
    "Samba",
    "Shopian",
    "Srinagar",
    "Udhampur",
  ],
  Ladakh: ["Kargil", "Leh"],
  Lakshadweep: ["Lakshadweep"],
  Puducherry: ["Karaikal", "Mahe", "Puducherry", "Yanam"],
};

/* ============================================================
   HELPERS
   ============================================================ */
function formatPrice(paise: bigint): string {
  const rupees = Number(paise) / 100;
  return `₹${rupees.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}

const QR_CELLS = Array.from({ length: 64 }, (_, i) => ({
  id: `qr-cell-${i}`,
  dark: (i * 37 + i * 7) % 10 > 4,
}));

/* ============================================================
   CONFETTI
   ============================================================ */
interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  delay: number;
  size: number;
  shape: "circle" | "square" | "triangle";
}

function generateConfetti(): ConfettiPiece[] {
  const colors = [
    "oklch(0.88 0.22 78)",
    "oklch(0.78 0.18 75)",
    "oklch(0.65 0.20 290)",
    "oklch(0.70 0.20 50)",
    "oklch(0.75 0.18 160)",
    "oklch(0.80 0.20 30)",
  ];
  return Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 50,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: Math.random() * 0.8,
    size: Math.random() * 12 + 4,
    shape: (["circle", "square", "triangle"] as const)[
      Math.floor(Math.random() * 3)
    ],
  }));
}

/* ============================================================
   PAYMENT TABS
   ============================================================ */
type PaymentTab = "upi" | "card" | "netbanking" | "googlepay";
type CheckoutStep = "shipping" | "payment";

interface ShippingAddress {
  fullName: string;
  place: string;
  address: string;
  houseNo: string;
  pincode: string;
  state: string;
  district: string;
}

const tabs: { id: PaymentTab; label: string; icon: React.ElementType }[] = [
  { id: "upi", label: "UPI", icon: Smartphone },
  { id: "card", label: "Card", icon: CreditCard },
  { id: "netbanking", label: "Net Banking", icon: Building2 },
  { id: "googlepay", label: "Google Pay", icon: Wallet },
];

/* ============================================================
   CREDIT CARD PREVIEW
   ============================================================ */
function CardPreview({
  number,
  name,
  expiry,
  flipped,
  cvv,
}: {
  number: string;
  name: string;
  expiry: string;
  flipped: boolean;
  cvv: string;
}) {
  const formatted = `${number}________________`
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();

  return (
    <div
      className="relative mx-auto"
      style={{ width: "280px", height: "170px", perspective: "1000px" }}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "100%", height: "100%", transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl p-5 flex flex-col justify-between"
          style={{
            backfaceVisibility: "hidden",
            background:
              "linear-gradient(135deg, oklch(0.20 0.06 280), oklch(0.28 0.08 260))",
            border: "1px solid oklch(0.78 0.18 75 / 0.4)",
            boxShadow:
              "0 10px 40px oklch(0 0 0 / 0.5), 0 0 20px oklch(0.78 0.18 75 / 0.2)",
          }}
        >
          <div className="flex justify-between items-start">
            <div
              className="w-10 h-7 rounded"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.78 0.18 75), oklch(0.88 0.22 78))",
              }}
            />
            <span
              className="text-xs font-sans"
              style={{ color: "oklch(0.78 0.18 75)" }}
            >
              VISA
            </span>
          </div>
          <div>
            <p
              className="font-mono text-base tracking-widest"
              style={{ color: "oklch(0.90 0.02 80)" }}
            >
              {formatted}
            </p>
            <div className="flex justify-between mt-2">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Card Holder
                </p>
                <p className="text-xs font-sans text-foreground uppercase tracking-wide">
                  {name || "YOUR NAME"}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Expires
                </p>
                <p className="text-xs font-sans text-foreground">
                  {expiry || "MM/YY"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background:
              "linear-gradient(135deg, oklch(0.18 0.05 280), oklch(0.25 0.07 260))",
            border: "1px solid oklch(0.78 0.18 75 / 0.4)",
            boxShadow: "0 10px 40px oklch(0 0 0 / 0.5)",
          }}
        >
          <div
            className="mt-8 h-10 w-full"
            style={{ background: "oklch(0.08 0.01 280)" }}
          />
          <div className="px-5 mt-4">
            <p className="text-xs text-muted-foreground mb-1">CVV</p>
            <div
              className="rounded px-3 py-1.5 font-mono text-sm text-right"
              style={{
                background: "oklch(0.90 0.02 80)",
                color: "oklch(0.10 0.01 280)",
              }}
            >
              {cvv || "•••"}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ============================================================
   SUCCESS SCREEN
   ============================================================ */
function SuccessScreen({ orderId }: { orderId: string }) {
  const navigate = useNavigate();
  const [confetti] = useState(generateConfetti);

  return (
    <div className="relative flex flex-col items-center justify-center py-16 gap-6 overflow-hidden">
      {confetti.map((p) => (
        <div
          key={p.id}
          className="confetti-piece pointer-events-none"
          style={
            {
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              borderRadius:
                p.shape === "circle"
                  ? "50%"
                  : p.shape === "square"
                    ? "2px"
                    : "0",
              "--delay": `${p.delay}s`,
              boxShadow: `0 0 ${p.size}px ${p.color}`,
            } as React.CSSProperties
          }
        />
      ))}

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.55 0.18 150), oklch(0.65 0.20 140))",
            boxShadow:
              "0 0 40px oklch(0.55 0.18 150 / 0.5), 0 0 80px oklch(0.55 0.18 150 / 0.25)",
          }}
        >
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-center"
      >
        <h2
          className="font-display font-black text-4xl text-shimmer"
          style={{ letterSpacing: "0.06em" }}
        >
          ORDER PLACED!
        </h2>
        <p className="text-muted-foreground font-sans mt-2">
          Your luxury items are on their way ✨
        </p>
        <div
          className="mt-4 px-6 py-3 rounded-xl glass-card"
          style={{ border: "1px solid oklch(0.78 0.18 75 / 0.2)" }}
        >
          <p className="text-xs text-muted-foreground font-sans">Order ID</p>
          <p
            className="font-mono text-sm font-bold mt-1"
            style={{ color: "oklch(0.78 0.18 75)" }}
          >
            {orderId}
          </p>
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate({ to: "/store" })}
        className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-sans font-bold"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.68 0.16 72), oklch(0.88 0.22 78))",
          color: "oklch(0.08 0.01 280)",
          boxShadow: "0 0 20px oklch(0.78 0.18 75 / 0.4)",
        }}
      >
        <ShoppingBag className="w-4 h-4" />
        Back to Store
      </motion.button>
    </div>
  );
}

/* ============================================================
   SHIPPING FORM
   ============================================================ */
const INPUT_STYLE = {
  background: "oklch(0.14 0.025 278)",
  border: "1px solid oklch(0.30 0.05 278)",
  color: "oklch(0.90 0.02 80)",
};

function ShippingForm({
  initialValues,
  onSubmit,
}: {
  initialValues: ShippingAddress;
  onSubmit: (addr: ShippingAddress) => void;
}) {
  const [form, setForm] = useState<ShippingAddress>(initialValues);
  const [locLoading, setLocLoading] = useState(false);

  const set = (field: keyof ShippingAddress, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      // Reset district when state changes
      ...(field === "state" ? { district: "" } : {}),
    }));
  };

  // Map common Nominatim state names to the exact keys used in INDIA_STATES_DISTRICTS
  const normaliseState = (raw: string): string => {
    if (!raw) return "";
    const stateKeys = Object.keys(INDIA_STATES_DISTRICTS);
    // Exact match first
    const exact = stateKeys.find((k) => k.toLowerCase() === raw.toLowerCase());
    if (exact) return exact;
    // Partial match (e.g. "Telangana" in raw)
    const partial = stateKeys.find(
      (k) =>
        raw.toLowerCase().includes(k.toLowerCase()) ||
        k.toLowerCase().includes(raw.toLowerCase()),
    );
    return partial ?? "";
  };

  const normaliseDistrict = (state: string, raw: string): string => {
    if (!state || !raw) return "";
    const districts = INDIA_STATES_DISTRICTS[state] ?? [];
    const exact = districts.find((d) => d.toLowerCase() === raw.toLowerCase());
    if (exact) return exact;
    const partial = districts.find(
      (d) =>
        raw.toLowerCase().includes(d.toLowerCase()) ||
        d.toLowerCase().includes(raw.toLowerCase()),
    );
    return partial ?? "";
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`,
            { headers: { "Accept-Language": "en" } },
          );
          if (!res.ok) throw new Error("Reverse geocode failed");
          const data = await res.json();
          const addr = data.address ?? {};

          const pincode = addr.postcode?.replace(/\s+/g, "").slice(0, 6) ?? "";
          const place =
            addr.city ||
            addr.town ||
            addr.village ||
            addr.suburb ||
            addr.county ||
            addr.state_district ||
            "";
          const rawState = addr.state ?? "";
          const state = normaliseState(rawState);
          const rawDistrict =
            addr.county ||
            addr.state_district ||
            addr.city_district ||
            addr.district ||
            "";
          const district = normaliseDistrict(state, rawDistrict);
          const address =
            [addr.road, addr.neighbourhood, addr.suburb]
              .filter(Boolean)
              .join(", ") || "";
          const houseNo = addr.house_number ?? "";

          setForm((prev) => ({
            ...prev,
            pincode: pincode || prev.pincode,
            place: place || prev.place,
            state: state || prev.state,
            district: district || prev.district,
            address: address || prev.address,
            houseNo: houseNo || prev.houseNo,
          }));
          toast.success("Location detected! Fields auto-filled.");
        } catch {
          toast.error(
            "Could not fetch location details. Please fill manually.",
          );
        } finally {
          setLocLoading(false);
        }
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          toast.error(
            "Location permission denied. Please allow access in your browser settings and try again.",
          );
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          toast.error(
            "Location unavailable. Please fill the address manually.",
          );
        } else {
          toast.error("Location request timed out. Please try again.");
        }
        setLocLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  const handleSubmit = () => {
    const trimmed: ShippingAddress = {
      fullName: form.fullName.trim(),
      place: form.place.trim(),
      address: form.address.trim(),
      houseNo: form.houseNo.trim(),
      pincode: form.pincode.trim(),
      state: form.state,
      district: form.district,
    };

    if (!trimmed.fullName) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!trimmed.houseNo) {
      toast.error("Please enter your house / flat number.");
      return;
    }
    if (!trimmed.address) {
      toast.error("Please enter your address.");
      return;
    }
    if (!trimmed.place) {
      toast.error("Please enter your city / town.");
      return;
    }
    if (!trimmed.pincode || trimmed.pincode.length !== 6) {
      toast.error("Please enter a valid 6-digit pincode.");
      return;
    }
    if (!trimmed.state) {
      toast.error("Please select your state.");
      return;
    }
    if (!trimmed.district) {
      toast.error("Please select your district.");
      return;
    }

    onSubmit(trimmed);
  };

  const districts = form.state
    ? (INDIA_STATES_DISTRICTS[form.state] ?? [])
    : [];

  return (
    <motion.div
      key="shipping-form"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35 }}
      className="glass-card rounded-2xl p-6 space-y-5"
      style={{ border: "1px solid oklch(0.78 0.18 75 / 0.15)" }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.68 0.16 72), oklch(0.88 0.22 78))",
          }}
        >
          <MapPin
            className="w-4 h-4"
            style={{ color: "oklch(0.08 0.01 280)" }}
          />
        </div>
        <div>
          <h2 className="font-heading font-bold text-xl text-foreground">
            Shipping Address
          </h2>
          <p className="text-xs text-muted-foreground font-sans">
            We'll deliver your order here
          </p>
        </div>
      </div>

      {/* Full Name */}
      <div className="space-y-1.5">
        <Label
          className="text-sm font-sans"
          style={{ color: "oklch(0.75 0.06 78)" }}
        >
          Full Name <span style={{ color: "oklch(0.68 0.20 25)" }}>*</span>
        </Label>
        <Input
          placeholder="Enter your full name"
          value={form.fullName}
          onChange={(e) => set("fullName", e.target.value)}
          autoComplete="name"
          className="font-sans"
          style={INPUT_STYLE}
        />
      </div>

      {/* House No + Place in a row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label
            className="text-sm font-sans"
            style={{ color: "oklch(0.75 0.06 78)" }}
          >
            House / Flat No.{" "}
            <span style={{ color: "oklch(0.68 0.20 25)" }}>*</span>
          </Label>
          <Input
            placeholder="House / Flat / Building No."
            value={form.houseNo}
            onChange={(e) => set("houseNo", e.target.value)}
            autoComplete="address-line2"
            className="font-sans"
            style={INPUT_STYLE}
          />
        </div>
        <div className="space-y-1.5">
          <Label
            className="text-sm font-sans"
            style={{ color: "oklch(0.75 0.06 78)" }}
          >
            City / Town <span style={{ color: "oklch(0.68 0.20 25)" }}>*</span>
          </Label>
          <Input
            placeholder="Enter your city / town"
            value={form.place}
            onChange={(e) => set("place", e.target.value)}
            autoComplete="address-level2"
            className="font-sans"
            style={INPUT_STYLE}
          />
        </div>
      </div>

      {/* Address */}
      <div className="space-y-1.5">
        <Label
          className="text-sm font-sans"
          style={{ color: "oklch(0.75 0.06 78)" }}
        >
          Address <span style={{ color: "oklch(0.68 0.20 25)" }}>*</span>
        </Label>
        <Textarea
          placeholder="Street name, landmark, etc."
          value={form.address}
          onChange={(e) => set("address", e.target.value)}
          rows={2}
          autoComplete="street-address"
          className="font-sans resize-none"
          style={INPUT_STYLE}
        />
      </div>

      {/* Pincode + Use Location */}
      <div className="space-y-1.5">
        <Label
          className="text-sm font-sans"
          style={{ color: "oklch(0.75 0.06 78)" }}
        >
          Pincode <span style={{ color: "oklch(0.68 0.20 25)" }}>*</span>
        </Label>
        <div className="flex gap-3">
          <Input
            placeholder="6-digit pincode"
            value={form.pincode}
            onChange={(e) =>
              set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            inputMode="numeric"
            maxLength={6}
            autoComplete="postal-code"
            className="font-mono flex-1"
            style={INPUT_STYLE}
          />
          <motion.button
            type="button"
            whileHover={{
              scale: 1.04,
              boxShadow: "0 0 14px oklch(0.78 0.22 75 / 0.45)",
            }}
            whileTap={{ scale: 0.96 }}
            onClick={handleUseLocation}
            disabled={locLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-sans font-semibold flex-shrink-0 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            style={{
              background: locLoading
                ? "oklch(0.20 0.06 278)"
                : "linear-gradient(135deg, oklch(0.30 0.12 75), oklch(0.22 0.08 278))",
              border: "1.5px solid oklch(0.78 0.22 75 / 0.6)",
              color: "oklch(0.92 0.18 75)",
              boxShadow: "0 0 8px oklch(0.78 0.18 75 / 0.25)",
            }}
          >
            {locLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation
                className="w-4 h-4"
                style={{ color: "oklch(0.88 0.22 75)" }}
              />
            )}
            {locLoading ? "Detecting..." : "Use My Location"}
          </motion.button>
        </div>
      </div>

      {/* State + District */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label
            className="text-sm font-sans"
            style={{ color: "oklch(0.75 0.06 78)" }}
          >
            State <span style={{ color: "oklch(0.68 0.20 25)" }}>*</span>
          </Label>
          <Select value={form.state} onValueChange={(v) => set("state", v)}>
            <SelectTrigger className="font-sans" style={INPUT_STYLE}>
              <SelectValue placeholder="Select state..." />
            </SelectTrigger>
            <SelectContent className="max-h-64">
              {Object.keys(INDIA_STATES_DISTRICTS)
                .sort()
                .map((st) => (
                  <SelectItem key={st} value={st}>
                    {st}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label
            className="text-sm font-sans"
            style={{ color: "oklch(0.75 0.06 78)" }}
          >
            District <span style={{ color: "oklch(0.68 0.20 25)" }}>*</span>
          </Label>
          <Select
            value={form.district}
            onValueChange={(v) => set("district", v)}
            disabled={!form.state}
          >
            <SelectTrigger className="font-sans" style={INPUT_STYLE}>
              <SelectValue
                placeholder={
                  form.state ? "Select district..." : "Select state first"
                }
              />
            </SelectTrigger>
            <SelectContent className="max-h-64">
              {districts.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Continue button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-sans font-bold text-base mt-2"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.68 0.16 72), oklch(0.88 0.22 78))",
          color: "oklch(0.08 0.01 280)",
          boxShadow:
            "0 0 25px oklch(0.78 0.18 75 / 0.5), 0 8px 24px oklch(0 0 0 / 0.3)",
        }}
      >
        Continue to Payment →
      </motion.button>
    </motion.div>
  );
}

/* ============================================================
   BUY NOW HELPERS
   ============================================================ */
interface BuyNowProduct {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  category: string;
  quantity: number;
}

function readBuyNowProduct(): BuyNowProduct | null {
  try {
    const raw = sessionStorage.getItem("buyNowProduct");
    if (!raw) return null;
    return JSON.parse(raw) as BuyNowProduct;
  } catch {
    return null;
  }
}

/* ============================================================
   STEP INDICATOR
   ============================================================ */
function StepIndicator({ step }: { step: CheckoutStep }) {
  const steps: { id: CheckoutStep; label: string }[] = [
    { id: "shipping", label: "Shipping Address" },
    { id: "payment", label: "Payment" },
  ];
  const currentIdx = steps.findIndex((s) => s.id === step);

  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((s, idx) => {
        const isActive = s.id === step;
        const isDone = idx < currentIdx;
        return (
          <div key={s.id} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-sans transition-all duration-300"
                style={
                  isActive
                    ? {
                        background:
                          "linear-gradient(135deg, oklch(0.68 0.16 72), oklch(0.88 0.22 78))",
                        color: "oklch(0.08 0.01 280)",
                        boxShadow: "0 0 12px oklch(0.78 0.18 75 / 0.5)",
                      }
                    : isDone
                      ? {
                          background: "oklch(0.55 0.18 150)",
                          color: "oklch(0.97 0.01 80)",
                        }
                      : {
                          background: "oklch(0.18 0.03 278)",
                          border: "1px solid oklch(0.30 0.05 278)",
                          color: "oklch(0.50 0.04 78)",
                        }
                }
              >
                {isDone ? "✓" : idx + 1}
              </div>
              <span
                className="text-sm font-sans font-medium transition-all duration-300"
                style={
                  isActive
                    ? { color: "oklch(0.88 0.22 78)" }
                    : isDone
                      ? { color: "oklch(0.55 0.18 150)" }
                      : { color: "oklch(0.50 0.04 78)" }
                }
              >
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className="mx-3 h-px w-12 transition-all duration-300"
                style={{
                  background:
                    isDone || isActive
                      ? "oklch(0.78 0.18 75 / 0.6)"
                      : "oklch(0.25 0.04 278)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
   MAIN CHECKOUT PAGE
   ============================================================ */
export default function CheckoutPage() {
  const navigate = useNavigate();
  const { data: cartItems } = useCart();
  const { data: products } = useProducts();
  const placeOrder = usePlaceOrder();
  const addToCart = useAddToCart();

  const [buyNowProduct] = useState<BuyNowProduct | null>(() =>
    readBuyNowProduct(),
  );

  // Checkout step state
  const [step, setStep] = useState<CheckoutStep>("shipping");
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: "",
    place: "",
    address: "",
    houseNo: "",
    pincode: "",
    state: "",
    district: "",
  });

  const [activeTab, setActiveTab] = useState<PaymentTab>("upi");
  const [orderId, setOrderId] = useState<string | null>(null);

  // UPI
  const [upiId, setUpiId] = useState("");
  // Card
  const [cardNum, setCardNum] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardFlipped, setCardFlipped] = useState(false);
  // Net banking
  const [bank, setBank] = useState("");

  const buyNowItems = buyNowProduct
    ? [
        {
          productId: buyNowProduct.id,
          quantity: BigInt(buyNowProduct.quantity),
          product: {
            id: buyNowProduct.id,
            name: buyNowProduct.name,
            price: BigInt(buyNowProduct.price),
            imageUrl: buyNowProduct.imageUrl,
            category: buyNowProduct.category,
            description: "",
            stock: 999n,
          },
        },
      ]
    : [];

  const cartWithProducts = buyNowProduct
    ? buyNowItems
    : (cartItems ?? []).map((item) => ({
        ...item,
        product: products?.find((p) => p.id === item.productId),
      }));

  const total = cartWithProducts.reduce((sum, item) => {
    if (!item.product) return sum;
    return sum + item.product.price * item.quantity;
  }, 0n);

  const handlePlaceOrder = async () => {
    let paymentMethod = "";
    if (activeTab === "upi") {
      if (!upiId.trim()) {
        toast.error("Please enter your UPI ID");
        return;
      }
      paymentMethod = `UPI: ${upiId}`;
    } else if (activeTab === "card") {
      if (!cardNum || !cardName || !cardExpiry || !cardCvv) {
        toast.error("Please fill all card details");
        return;
      }
      paymentMethod = `Card: ****${cardNum.slice(-4)}`;
    } else if (activeTab === "netbanking") {
      if (!bank) {
        toast.error("Please select a bank");
        return;
      }
      paymentMethod = `Net Banking: ${bank}`;
    } else if (activeTab === "googlepay") {
      paymentMethod = "Google Pay";
    }

    // Append shipping info to payment method string for order metadata
    const shippingInfo = `| Ship to: ${shippingAddress.fullName}, ${shippingAddress.houseNo}, ${shippingAddress.address}, ${shippingAddress.place}, ${shippingAddress.district}, ${shippingAddress.state} - ${shippingAddress.pincode}`;
    paymentMethod = `${paymentMethod} ${shippingInfo}`;

    try {
      if (buyNowProduct) {
        await addToCart.mutateAsync({
          productId: buyNowProduct.id,
          quantity: BigInt(buyNowProduct.quantity),
        });
      }
      const id = await placeOrder.mutateAsync(paymentMethod);
      sessionStorage.removeItem("buyNowProduct");
      setOrderId(id);
    } catch {
      toast.error("Please log in to place your order.");
    }
  };

  if (orderId) {
    return (
      <div
        className="min-h-screen"
        style={{ background: "oklch(0.08 0.015 280)" }}
      >
        <div className="max-w-2xl mx-auto px-4 py-16">
          <SuccessScreen orderId={orderId} />
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.08 0.015 280)" }}
    >
      {/* Header */}
      <div
        className="py-10 px-4 text-center"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, oklch(0.18 0.06 278 / 0.5) 0%, transparent 70%)",
          borderBottom: "1px solid oklch(0.78 0.18 75 / 0.12)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1
            className="font-display font-black text-4xl text-shimmer"
            style={{ letterSpacing: "0.08em" }}
          >
            CHECKOUT
          </h1>
          <p className="text-muted-foreground font-sans text-sm mt-1">
            Secure · Encrypted · Instant
          </p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Step Indicator */}
        <StepIndicator step={step} />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left panel: Shipping or Payment */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {step === "shipping" ? (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Back button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (buyNowProduct) {
                        sessionStorage.removeItem("buyNowProduct");
                        navigate({ to: "/store" });
                      } else {
                        navigate({ to: "/cart" });
                      }
                    }}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-sans transition-colors mb-6"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {buyNowProduct ? "Back to Store" : "Back to Cart"}
                  </button>

                  <ShippingForm
                    initialValues={shippingAddress}
                    onSubmit={(addr) => {
                      setShippingAddress(addr);
                      setStep("payment");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Back to shipping */}
                  <button
                    type="button"
                    onClick={() => setStep("shipping")}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-sans transition-colors mb-6"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Shipping Address
                  </button>

                  {/* Shipping to summary card */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="glass-card rounded-xl px-4 py-3 mb-5 flex items-start justify-between gap-3"
                    style={{
                      border: "1px solid oklch(0.78 0.18 75 / 0.2)",
                    }}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          background: "oklch(0.78 0.18 75 / 0.15)",
                          border: "1px solid oklch(0.78 0.18 75 / 0.3)",
                        }}
                      >
                        <MapPin
                          className="w-4 h-4"
                          style={{ color: "oklch(0.78 0.18 75)" }}
                        />
                      </div>
                      <div className="min-w-0">
                        <p
                          className="text-xs font-sans font-semibold mb-0.5"
                          style={{ color: "oklch(0.78 0.18 75)" }}
                        >
                          Shipping to
                        </p>
                        <p className="text-sm font-sans text-foreground font-medium">
                          {shippingAddress.fullName}
                        </p>
                        <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                          {shippingAddress.houseNo}, {shippingAddress.address},{" "}
                          {shippingAddress.place}
                          <br />
                          {shippingAddress.district}, {shippingAddress.state} —{" "}
                          {shippingAddress.pincode}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep("shipping")}
                      className="flex items-center gap-1 text-xs font-sans flex-shrink-0 mt-1 transition-opacity hover:opacity-80"
                      style={{ color: "oklch(0.78 0.18 75)" }}
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </button>
                  </motion.div>

                  {/* Payment method tabs */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="glass-card rounded-2xl p-6"
                    style={{ border: "1px solid oklch(0.78 0.18 75 / 0.15)" }}
                  >
                    <h2 className="font-heading font-bold text-xl text-foreground mb-5">
                      Select Payment Method
                    </h2>

                    {/* Tab buttons */}
                    <div className="flex gap-2 flex-wrap mb-6">
                      {tabs.map(({ id, label, icon: Icon }) => (
                        <button
                          type="button"
                          key={id}
                          onClick={() => setActiveTab(id)}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-sans font-medium transition-all duration-200"
                          style={
                            activeTab === id
                              ? {
                                  background:
                                    "linear-gradient(135deg, oklch(0.68 0.16 72), oklch(0.88 0.22 78))",
                                  color: "oklch(0.08 0.01 280)",
                                  boxShadow:
                                    "0 0 15px oklch(0.78 0.18 75 / 0.4)",
                                }
                              : {
                                  background: "oklch(0.18 0.03 278)",
                                  border: "1px solid oklch(0.30 0.05 278)",
                                  color: "oklch(0.65 0.04 78)",
                                }
                          }
                        >
                          <Icon className="w-4 h-4" />
                          {label}
                        </button>
                      ))}
                    </div>

                    {/* Tab content */}
                    <AnimatePresence mode="wait">
                      {activeTab === "upi" && (
                        <motion.div
                          key="upi"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-5"
                        >
                          <div>
                            <Label className="text-sm text-muted-foreground font-sans mb-2 block">
                              UPI ID
                            </Label>
                            <Input
                              placeholder="yourname@bank"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              className="font-sans"
                              style={INPUT_STYLE}
                            />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground font-sans mb-3">
                              Supported UPI Apps:
                            </p>
                            <div className="grid grid-cols-4 gap-3">
                              {[
                                {
                                  name: "Google Pay",
                                  emoji: "💳",
                                  color: "oklch(0.55 0.20 240)",
                                },
                                {
                                  name: "PhonePe",
                                  emoji: "📱",
                                  color: "oklch(0.50 0.20 280)",
                                },
                                {
                                  name: "Paytm",
                                  emoji: "💰",
                                  color: "oklch(0.55 0.20 200)",
                                },
                                {
                                  name: "BHIM",
                                  emoji: "🏦",
                                  color: "oklch(0.50 0.18 25)",
                                },
                              ].map((app) => (
                                <button
                                  type="button"
                                  key={app.name}
                                  className="flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer transition-all hover:opacity-80"
                                  style={{
                                    background: "oklch(0.16 0.03 278)",
                                    border: `1px solid ${app.color} / 0.3`,
                                    borderColor: `${app.color}`,
                                  }}
                                  onClick={() =>
                                    setUpiId(
                                      `yourname@${app.name.toLowerCase().replace(" ", "")}`,
                                    )
                                  }
                                >
                                  <span className="text-2xl">{app.emoji}</span>
                                  <span className="text-[10px] text-muted-foreground font-sans text-center">
                                    {app.name}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === "card" && (
                        <motion.div
                          key="card"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-5"
                        >
                          <CardPreview
                            number={cardNum}
                            name={cardName}
                            expiry={cardExpiry}
                            flipped={cardFlipped}
                            cvv={cardCvv}
                          />
                          <div className="grid grid-cols-1 gap-4 mt-4">
                            <div>
                              <Label className="text-xs text-muted-foreground font-sans mb-1.5 block">
                                Card Number
                              </Label>
                              <Input
                                placeholder="1234 5678 9012 3456"
                                value={cardNum}
                                maxLength={16}
                                onChange={(e) =>
                                  setCardNum(e.target.value.replace(/\D/g, ""))
                                }
                                className="font-mono"
                                style={INPUT_STYLE}
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground font-sans mb-1.5 block">
                                Cardholder Name
                              </Label>
                              <Input
                                placeholder="JOHN DOE"
                                value={cardName}
                                onChange={(e) =>
                                  setCardName(e.target.value.toUpperCase())
                                }
                                className="font-sans"
                                style={INPUT_STYLE}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-xs text-muted-foreground font-sans mb-1.5 block">
                                  Expiry Date
                                </Label>
                                <Input
                                  placeholder="MM/YY"
                                  value={cardExpiry}
                                  maxLength={5}
                                  onChange={(e) => {
                                    let val = e.target.value.replace(/\D/g, "");
                                    if (val.length >= 3)
                                      val = `${val.slice(0, 2)}/${val.slice(2)}`;
                                    setCardExpiry(val);
                                  }}
                                  className="font-mono"
                                  style={INPUT_STYLE}
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-muted-foreground font-sans mb-1.5 block">
                                  CVV
                                </Label>
                                <Input
                                  placeholder="•••"
                                  type="password"
                                  value={cardCvv}
                                  maxLength={4}
                                  onFocus={() => setCardFlipped(true)}
                                  onBlur={() => setCardFlipped(false)}
                                  onChange={(e) =>
                                    setCardCvv(
                                      e.target.value.replace(/\D/g, ""),
                                    )
                                  }
                                  className="font-mono"
                                  style={INPUT_STYLE}
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === "netbanking" && (
                        <motion.div
                          key="netbanking"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-4"
                        >
                          <div>
                            <Label className="text-sm text-muted-foreground font-sans mb-2 block">
                              Select Your Bank
                            </Label>
                            <Select value={bank} onValueChange={setBank}>
                              <SelectTrigger style={INPUT_STYLE}>
                                <SelectValue placeholder="Choose bank..." />
                              </SelectTrigger>
                              <SelectContent>
                                {[
                                  "State Bank of India (SBI)",
                                  "HDFC Bank",
                                  "ICICI Bank",
                                  "Axis Bank",
                                  "Kotak Mahindra Bank",
                                  "Punjab National Bank",
                                  "Bank of Baroda",
                                  "Canara Bank",
                                  "Yes Bank",
                                  "IndusInd Bank",
                                ].map((b) => (
                                  <SelectItem key={b} value={b}>
                                    {b}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {bank && (
                            <motion.div
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-4 rounded-xl"
                              style={{
                                background: "oklch(0.16 0.03 278)",
                                border: "1px solid oklch(0.78 0.18 75 / 0.2)",
                              }}
                            >
                              <p className="text-sm font-sans text-muted-foreground">
                                You will be redirected to{" "}
                                <span style={{ color: "oklch(0.78 0.18 75)" }}>
                                  {bank}
                                </span>
                                's secure portal to complete payment.
                              </p>
                            </motion.div>
                          )}
                        </motion.div>
                      )}

                      {activeTab === "googlepay" && (
                        <motion.div
                          key="googlepay"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-col items-center gap-5 py-4"
                        >
                          <div
                            className="w-48 h-48 rounded-2xl flex items-center justify-center relative overflow-hidden"
                            style={{
                              background: "oklch(0.95 0.01 80)",
                              border: "3px solid oklch(0.78 0.18 75 / 0.5)",
                              boxShadow: "0 0 25px oklch(0.78 0.18 75 / 0.2)",
                            }}
                          >
                            <div
                              className="grid gap-1"
                              style={{
                                gridTemplateColumns: "repeat(8, 1fr)",
                                width: "120px",
                                height: "120px",
                              }}
                            >
                              {QR_CELLS.map(({ id, dark }) => (
                                <div
                                  key={id}
                                  style={{
                                    background: dark
                                      ? "oklch(0.08 0.01 280)"
                                      : "transparent",
                                    borderRadius: "1px",
                                  }}
                                />
                              ))}
                            </div>
                            {[
                              { top: 8, left: 8, id: "tl" },
                              { top: 8, right: 8, id: "tr" },
                              { bottom: 8, left: 8, id: "bl" },
                            ].map(({ id, ...pos }) => (
                              <div
                                key={id}
                                className="absolute w-10 h-10 border-4 rounded-sm"
                                style={{
                                  ...pos,
                                  borderColor: "oklch(0.08 0.01 280)",
                                }}
                              />
                            ))}
                          </div>
                          <div className="text-center">
                            <p className="font-sans font-semibold text-foreground">
                              Scan with Google Pay
                            </p>
                            <p className="text-sm text-muted-foreground mt-1 font-sans">
                              Open Google Pay and scan this QR code to pay{" "}
                              <span style={{ color: "oklch(0.78 0.18 75)" }}>
                                {formatPrice(total)}
                              </span>
                            </p>
                          </div>
                          <div className="flex gap-3">
                            {["GPay", "PhonePe", "Paytm"].map((app) => (
                              <span
                                key={app}
                                className="text-xs font-sans px-3 py-1.5 rounded-full"
                                style={{
                                  background: "oklch(0.16 0.03 278)",
                                  border: "1px solid oklch(0.78 0.18 75 / 0.2)",
                                  color: "oklch(0.70 0.04 78)",
                                }}
                              >
                                {app}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Place order button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePlaceOrder}
                      disabled={placeOrder.isPending}
                      className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-sans font-bold text-base mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.68 0.16 72), oklch(0.88 0.22 78))",
                        color: "oklch(0.08 0.01 280)",
                        boxShadow: placeOrder.isPending
                          ? "none"
                          : "0 0 25px oklch(0.78 0.18 75 / 0.5), 0 8px 24px oklch(0 0 0 / 0.3)",
                      }}
                    >
                      {placeOrder.isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <CheckCircle className="w-5 h-5" />
                      )}
                      {placeOrder.isPending
                        ? "Processing..."
                        : `Place Order · ${formatPrice(total)}`}
                    </motion.button>

                    {/* Security badges */}
                    <div className="flex items-center justify-center gap-4 mt-4">
                      {[
                        "🔐 256-bit SSL",
                        "🛡️ Secure Checkout",
                        "✅ PCI DSS",
                      ].map((b) => (
                        <span
                          key={b}
                          className="text-xs text-muted-foreground font-sans"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order summary sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="lg:w-72 flex-shrink-0"
          >
            <div
              className="glass-card rounded-2xl p-5 sticky top-24"
              style={{ border: "1px solid oklch(0.78 0.18 75 / 0.2)" }}
            >
              <h2 className="font-heading font-bold text-lg text-foreground mb-4">
                Order Summary
              </h2>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cartWithProducts.map((item) => (
                  <div key={item.productId} className="flex gap-3 items-center">
                    <div
                      className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0"
                      style={{
                        border: "1px solid oklch(0.78 0.18 75 / 0.15)",
                      }}
                    >
                      {item.product && (
                        <img
                          src={
                            item.product.imageUrl?.startsWith("http")
                              ? item.product.imageUrl
                              : "/assets/generated/rz-store-hero.dim_600x600.png"
                          }
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-sans text-foreground truncate">
                        {item.product?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        × {String(item.quantity)}
                      </p>
                    </div>
                    <p
                      className="text-xs font-display font-bold flex-shrink-0"
                      style={{ color: "oklch(0.78 0.18 75)" }}
                    >
                      {item.product
                        ? formatPrice(item.product.price * item.quantity)
                        : "—"}
                    </p>
                  </div>
                ))}
              </div>
              <div
                className="border-t pt-4"
                style={{ borderColor: "oklch(0.78 0.18 75 / 0.2)" }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-heading font-bold text-foreground">
                    Total
                  </span>
                  <span
                    className="font-display font-black text-xl"
                    style={{
                      color: "oklch(0.88 0.22 78)",
                      textShadow: "0 0 12px oklch(0.78 0.18 75 / 0.4)",
                    }}
                  >
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
