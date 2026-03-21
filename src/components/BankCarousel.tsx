import axisBank from "@/assets/banks/axis-bank.png";
import kotak from "@/assets/banks/kotak.jpg";
import icici from "@/assets/banks/icici.jpg";
import bank2 from "@/assets/banks/bank-2.svg";
import bank4 from "@/assets/banks/bank-4.svg";
import bank5 from "@/assets/banks/bank-5.svg";

const bankLogos = [
  { src: axisBank, name: "Axis Bank" },
  { src: kotak, name: "Kotak Mahindra Bank" },
  { src: icici, name: "ICICI Bank" },
  { src: bank2, name: "Bank Partner" },
  { src: bank4, name: "Bank Partner" },
  { src: bank5, name: "Bank Partner" },
];

const BankCarousel = () => {
  const duplicated = [...bankLogos, ...bankLogos];

  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex items-center gap-6 animate-bank-scroll w-max">
        {duplicated.map((bank, i) => (
          <div
            key={`${bank.name}-${i}`}
            className="shrink-0 w-[140px] h-[80px] md:w-[180px] md:h-[100px] rounded-xl bg-card border border-border/50 flex items-center justify-center p-3 shadow-md hover:shadow-lg hover:border-accent/30 transition-all duration-300"
          >
            <div className="w-full h-full flex items-center justify-center min-w-0 min-h-0">
              <img
                src={bank.src}
                alt={bank.name}
                className="w-full h-full object-contain object-center"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BankCarousel;
