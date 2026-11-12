import motion from './FeaturedProducts.module.css';

/** Exact-value Tailwind v4 utilities for Featured Products only.
 * Inclusive pixel queries preserve the original 640px/767px boundaries.
 * Disjoint queries prevent the 767px utilities from overriding 640px values.
 */
export const featuredProductStyles = {
  section: [
    motion.section,
    "pt-[24px] pb-[52px] px-0 text-[#122c4e]",
    "[&_a:focus-visible]:[outline:3px_solid_#075bb9] [&_a:focus-visible]:outline-offset-[4px]",
    "[&_button:focus-visible]:[outline:3px_solid_#075bb9] [&_button:focus-visible]:outline-offset-[4px]",
  ].join(' '),
  container: [
    "max-w-[1280px] mx-auto py-0 px-[32px]",
    "[@media(max-width:767px)]:px-[16px]",
  ].join(' '),
  header: [
    "flex items-center justify-between gap-[20px] mb-[24px]",
    "[@media(max-width:767px)]:items-start [@media(max-width:767px)]:flex-col [@media(max-width:767px)]:gap-[14px]",
  ].join(' '),
  headingGroup: [
    "flex items-center gap-[14px] min-w-0",
    "[@media(max-width:767px)]:gap-[10px]",
  ].join(' '),
  headingIcon: [
    "w-[44px] h-[44px] grid place-items-center shrink-0 bg-[#fff8dc] text-[#bd8500] border border-[#f3e3ad] rounded-[50%]",
    "[@media(max-width:767px)]:w-[38px] [@media(max-width:767px)]:h-[38px]",
  ].join(' '),
  heading: [
    "font-serif text-[clamp(24px,2.2vw,32px)] font-[700] leading-[1.2] tracking-[-.02em] text-[#102b4c]",
  ].join(' '),
  subtitle: [
    "mt-[5px] text-[12px] leading-[1.5] font-[400] text-[#53677d]",
  ].join(' '),
  viewAll: [
    "inline-flex items-center justify-center shrink-0 min-h-[44px] py-[11px] px-[18px] border border-[#d6e5f4] rounded-[999px] bg-[#ffffffd9] text-[#124e94] text-[12px] leading-[1.4] font-[700] [box-shadow:0_3px_9px_#245d9310]",
    "[&:hover]:bg-white [&:hover]:border-[#92b9dd]",
  ].join(' '),
  grid: [
    "grid grid-cols-4 [grid-auto-rows:1fr] gap-[20px]",
    "[@media(min-width:1024px)]:w-[94%] [@media(min-width:1024px)]:mx-auto",
    "[@media(767px<width<=1023px)]:grid-cols-3",
    "[@media(max-width:767px)]:grid-cols-2 [@media(max-width:767px)]:gap-y-[16px] [@media(max-width:767px)]:gap-x-[12px]",
  ].join(' '),
  entrance: [
    motion.entrance,
    "min-w-0",
    "[@media(max-width:640px)]:[&:nth-child(n+7)]:hidden",
  ].join(' '),
  floating: [
    motion.floating,
    "h-full",
  ].join(' '),
  card: [
    motion.card,
    "flex flex-col h-full p-[9px] border border-[#dce6ef] rounded-[24px] bg-[linear-gradient(145deg,#fff,#fcfdff)] [box-shadow:0_7px_20px_-10px_#214f8033]",
    "[@media(max-width:767px)]:rounded-[22px]",
    "[@media(640px<width<=767px)]:p-[7px]",
    "[@media(max-width:640px)]:p-[10px]",
  ].join(' '),
  media: [
    "relative",
  ].join(' '),
  imageLink: [
    "block relative h-[clamp(160px,19vw,200px)] rounded-[18px] bg-[linear-gradient(140deg,#f8fafc,#eef3f8)] overflow-hidden",
    "[@media(max-width:767px)]:rounded-[16px]",
    "[@media(640px<width<=767px)]:h-auto [@media(640px<width<=767px)]:aspect-[1.16]",
    "[@media(max-width:640px)]:h-[clamp(130px,32.6vw,140px)] [@media(max-width:640px)]:aspect-auto",
  ].join(' '),
  image: [
    motion.image,
    "block w-full h-full object-cover object-center text-[#485e73] text-[12px]",
  ].join(' '),
  badge: [
    "absolute top-[12px] left-[12px] max-w-[calc(100%_-_24px)] py-[5px] px-[10px] rounded-[999px] text-[10px] leading-[1.2] font-[750] [box-shadow:0_3px_8px_#122e491a] pointer-events-none",
    "[@media(max-width:767px)]:top-[8px] [@media(max-width:767px)]:left-[8px] [@media(max-width:767px)]:py-[4px] [@media(max-width:767px)]:px-[7px] [@media(max-width:767px)]:text-[9px] [@media(max-width:767px)]:max-w-[calc(100%_-_16px)]",
  ].join(' '),
  bestSeller: [
    "bg-[#123c73] text-[#ffffff]",
  ].join(' '),
  popular: [
    "bg-[#ffdb76] text-[#493300]",
  ].join(' '),
  newArrival: [
    "bg-[#e0f4e8] text-[#18613c] border border-[#b9dec9]",
  ].join(' '),
  details: [
    "flex-1 flex flex-col pt-[12px] px-[9px] pb-[8px]",
    "[@media(640px<width<=767px)]:pt-[10px] [@media(640px<width<=767px)]:px-[5px] [@media(640px<width<=767px)]:pb-[6px]",
    "[@media(max-width:640px)]:pt-[8px] [@media(max-width:640px)]:px-[2px] [@media(max-width:640px)]:pb-[2px]",
  ].join(' '),
  name: [
    "min-h-[36px] text-[#122c4e] text-[15px] font-[700] leading-[1.35] tracking-[-.015em] [&:hover]:text-[#0755a8]",
    "[@media(640px<width<=767px)]:text-[14px] [@media(640px<width<=767px)]:min-h-[38px]",
    "[@media(max-width:640px)]:line-clamp-2 [@media(max-width:640px)]:min-h-[36.5px] [@media(max-width:640px)]:text-[13.5px]",
  ].join(' '),
  description: [
    "min-h-[32px] mt-[3px] text-[#64748b] text-[12px] leading-[1.5] font-[400]",
    "[@media(max-width:767px)]:text-[11px] [@media(max-width:767px)]:min-h-[34px]",
    "[@media(max-width:640px)]:hidden",
  ].join(' '),
  rating: [
    "flex items-center gap-[5px] mt-[6px] text-[#34475b] text-[12px] leading-[1.4] font-[600] [&_svg]:text-[#b47b00] [&_svg]:fill-[#ffcf58]",
    "[@media(max-width:640px)]:mt-[4px] [@media(max-width:640px)]:gap-[4px] [@media(max-width:640px)]:text-[11px] [@media(max-width:640px)]:[&_svg]:w-[12px] [@media(max-width:640px)]:[&_svg]:h-[12px]",
  ].join(' '),
  reviewCount: [
    "ml-[2px] text-[#7a8898] text-[11px] font-[400]",
    "[@media(max-width:640px)]:text-[10px]",
  ].join(' '),
  purchase: [
    "mt-auto pt-[8px]",
    "[@media(max-width:640px)]:pt-[6px]",
  ].join(' '),
  price: [
    "text-[#102f59] text-[21px] font-[750] leading-[1.3] tracking-[-.03em]",
    "[@media(640px<width<=767px)]:text-[19px]",
    "[@media(max-width:640px)]:text-[18px]",
  ].join(' '),
  addButton: [
    motion.addButton,
    "flex items-center justify-center gap-[8px] w-full min-h-[42px] mt-[8px] py-[10px] px-[12px] border border-[#123c73] rounded-[999px] bg-[#123c73] text-[#ffffff] text-[12px] leading-[1.3] font-[650] cursor-pointer",
    "[&:hover]:bg-[#0755a8] [&:hover]:border-[#0755a8]",
    "[@media(max-width:767px)]:text-[11px] [@media(max-width:767px)]:gap-[5px] [@media(max-width:767px)]:px-[6px]",
    "[@media(max-width:640px)]:min-h-[38px] [@media(max-width:640px)]:mt-[6px] [@media(max-width:640px)]:py-[8px] [@media(max-width:640px)]:[&_svg]:w-[14px] [@media(max-width:640px)]:[&_svg]:h-[14px]",
  ].join(' '),
} as const;
