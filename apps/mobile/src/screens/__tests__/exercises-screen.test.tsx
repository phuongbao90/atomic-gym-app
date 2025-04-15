import { API_ROUTES } from "app/src/configs/api-routes";
import { ENV } from "app/src/configs/env";
import nock from "nock";
import {
  customRenderUI,
  customRenderInfiniteQueryHook,
} from "../../utils/test-utils";
import { ExercisesScreen } from "../exercises/exercises-screen";
import { Exercise, useGetExercises } from "app";
import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from "@testing-library/react-native";

const exercisePage1 = {
  data: [
    {
      id: 1,
      notes:
        "Crepusculum surgo ab solium aegre eos. Cruciamentum laudantium delicate acquiro vetus universe convoco. Subnecto corroboro exercitationem despecto canto tibi anser demergo.",
      category: "WEIGHT",
      createdById: 8,
      images: [
        "https://picsum.photos/seed/oieCLZWG/1112/1983",
        "https://loremflickr.com/1885/2853?lock=7104808881115842",
        "https://picsum.photos/seed/Ptf8FlttN/3310/514",
      ],
      createdAt: "2025-04-11T14:09:26.091Z",
      updatedAt: "2025-04-11T14:09:26.091Z",
      workoutId: null,
      primaryMuscle: [
        {
          id: 3,
          parentId: null,
          image: "https://picsum.photos/seed/rL1q3l8g/196/533",
          translations: [
            {
              muscleGroupId: 3,
              language: "vi",
              name: "Khác",
              normalizedName: "khac",
              slug: "khac",
            },
          ],
        },
      ],
      translations: [
        {
          exerciseId: 1,
          language: "vi",
          name: "Năm được không chỉ chết chỉ.",
          normalizedName: "nam duoc khong chi chet chi",
          description:
            "Quần tàu cửa chết. Thế tím bảy mướn mướn. Ghét hai biển nghỉ.",
          slug: "nam-duoc-khong-chi-chet-chi",
        },
      ],
    },
    {
      id: 2,
      notes:
        "Ab caste turbo decens apostolus templum. Deficio sopor appositus creta sumptus versus. Spoliatio decretum avarus auditor deludo voluntarius aufero conservo aurum bestia.",
      category: "WEIGHT",
      createdById: 13,
      images: [
        "https://picsum.photos/seed/uEcJQ3/1397/2867",
        "https://picsum.photos/seed/APWJYf/1994/1602",
        "https://picsum.photos/seed/aokTCIL/2476/2629",
      ],
      createdAt: "2025-04-11T14:09:26.097Z",
      updatedAt: "2025-04-11T14:09:26.507Z",
      workoutId: 38,
      primaryMuscle: [
        {
          id: 2,
          parentId: null,
          image: "https://loremflickr.com/2583/1708?lock=4437472374622822",
          translations: [
            {
              muscleGroupId: 2,
              language: "vi",
              name: "Thân dưới",
              normalizedName: "than duoi",
              slug: "than-duoi",
            },
          ],
        },
      ],
      translations: [
        {
          exerciseId: 2,
          language: "vi",
          name: "Thương ghét nhà đâu xuồng.",
          normalizedName: "thuong ghet nha dau xuong",
          description:
            "Thuyền sáu áo bè. Yêu không leo bốn một yêu. Tô chết tủ chìm.",
          slug: "thuong-ghet-nha-dau-xuong",
        },
      ],
    },
    {
      id: 3,
      notes:
        "Adiuvo laborum viscus voluptas tripudio acsi. Tolero somniculosus adeptio cultellus arcus beneficium trepide. Xiphias textor vitiosus tactus vulnero quidem speculum volubilis voluptatibus.",
      category: "WEIGHT",
      createdById: 13,
      images: [
        "https://picsum.photos/seed/8VZWxJDw5/190/2094",
        "https://loremflickr.com/2284/3199?lock=7386711068356818",
        "https://loremflickr.com/576/1963?lock=5683629671960634",
      ],
      createdAt: "2025-04-11T14:09:26.101Z",
      updatedAt: "2025-04-11T14:09:26.524Z",
      workoutId: 47,
      primaryMuscle: [
        {
          id: 8,
          parentId: 1,
          image: "https://loremflickr.com/1349/3502?lock=7703903488261586",
          translations: [
            {
              muscleGroupId: 8,
              language: "vi",
              name: "Lưng giữa",
              normalizedName: "lung giua",
              slug: "lung-giua",
            },
          ],
        },
      ],
      translations: [
        {
          exerciseId: 3,
          language: "vi",
          name: "Ờ mua bốn tàu là trăng tui nón.",
          normalizedName: "o mua bon tau la trang tui non",
          description:
            "Khoan đánh tôi quê khoảng ác đá giết. Năm lỗi không. Là khâu xe độc thế máy làm.",
          slug: "o-mua-bon-tau-la-trang-tui-non",
        },
      ],
    },
    {
      id: 4,
      notes:
        "Ut dolorem contabesco comes uredo creator. Terminatio usitas hic nulla vorax curia nobis amplitudo quidem. Atqui agnitio timidus cribro.",
      category: "CARDIO",
      createdById: 3,
      images: [
        "https://loremflickr.com/2025/2330?lock=1404547483301774",
        "https://picsum.photos/seed/CBT3xaZ/1296/757",
        "https://picsum.photos/seed/sfnkTXmTS/2950/3676",
      ],
      createdAt: "2025-04-11T14:09:26.104Z",
      updatedAt: "2025-04-11T14:09:26.521Z",
      workoutId: 45,
      primaryMuscle: [
        {
          id: 4,
          parentId: 1,
          image: "https://picsum.photos/seed/oWFQPP/1088/2644",
          translations: [
            {
              muscleGroupId: 4,
              language: "vi",
              name: "Ngực",
              normalizedName: "nguc",
              slug: "nguc",
            },
          ],
        },
      ],
      translations: [
        {
          exerciseId: 4,
          language: "vi",
          name: "Ừ ghế ác.",
          normalizedName: "u ghe ac",
          description:
            "Làm ừ thích nha làm khoảng tui bè tôi xe. Ừ đạp vẽ không nghỉ. Dép tui vẽ nha bảy.",
          slug: "u-ghe-ac",
        },
      ],
    },
    {
      id: 5,
      notes:
        "Volo adipisci vado arbustum timor illo agnosco balbus tempora curvo. Versus dedico aranea utrum undique asporto. Contego vigor calculus repudiandae soluta.",
      category: "WEIGHT",
      createdById: 15,
      images: [
        "https://loremflickr.com/3576/2286?lock=5930001775695301",
        "https://picsum.photos/seed/IevUaYjVr/2405/2211",
        "https://loremflickr.com/860/3413?lock=6484125579998883",
      ],
      createdAt: "2025-04-11T14:09:26.107Z",
      updatedAt: "2025-04-11T14:09:26.498Z",
      workoutId: 33,
      primaryMuscle: [
        {
          id: 2,
          parentId: null,
          image: "https://loremflickr.com/2583/1708?lock=4437472374622822",
          translations: [
            {
              muscleGroupId: 2,
              language: "vi",
              name: "Thân dưới",
              normalizedName: "than duoi",
              slug: "than-duoi",
            },
          ],
        },
      ],
      translations: [
        {
          exerciseId: 5,
          language: "vi",
          name: "Tui khoảng nón ác trăng ba.",
          normalizedName: "tui khoang non ac trang ba",
          description:
            "Cửa áo giày hóa. Mướn một ờ gió nước nước xe xanh đang ghét. Bè ba xanh không năm vàng.",
          slug: "tui-khoang-non-ac-trang-ba",
        },
      ],
    },
    {
      id: 6,
      notes:
        "Supra cogo voluptate angustus sed patior vito vacuus adstringo abscido. Vulticulus via ut soluta vesper. Sperno hic cunctatio approbo audeo ducimus cupressus.",
      category: "WEIGHT",
      createdById: 5,
      images: [
        "https://picsum.photos/seed/Pi0g38CZA/2038/719",
        "https://picsum.photos/seed/pEwjKF/1651/3745",
        "https://loremflickr.com/2863/624?lock=6767689843405468",
      ],
      createdAt: "2025-04-11T14:09:26.109Z",
      updatedAt: "2025-04-11T14:09:26.525Z",
      workoutId: 48,
      primaryMuscle: [
        {
          id: 18,
          parentId: 2,
          image: "https://loremflickr.com/3085/3156?lock=3144129950477851",
          translations: [
            {
              muscleGroupId: 18,
              language: "vi",
              name: "Bắp mông giữa",
              normalizedName: "bap mong giua",
              slug: "bap-mong-giua",
            },
          ],
        },
      ],
      translations: [
        {
          exerciseId: 6,
          language: "vi",
          name: "Lỗi lỗi bơi chết.",
          normalizedName: "loi loi boi chet",
          description:
            "Một hóa hàng. Vá một đỏ thích ừ vá thế. Sáu nghỉ nha phá trời ờ vá.",
          slug: "loi-loi-boi-chet",
        },
      ],
    },
    {
      id: 7,
      notes:
        "Tyrannus ait voluptatum curtus adversus. Magni vulgus tripudio consequuntur decet subito subseco. Administratio volaticus copia tempora baiulus incidunt denuo.",
      category: "CARDIO",
      createdById: 5,
      images: [
        "https://loremflickr.com/2586/3559?lock=4740865993816649",
        "https://picsum.photos/seed/pw3I4h/91/764",
        "https://loremflickr.com/381/692?lock=6645951487040620",
      ],
      createdAt: "2025-04-11T14:09:26.113Z",
      updatedAt: "2025-04-11T14:09:26.513Z",
      workoutId: 40,
      primaryMuscle: [
        {
          id: 6,
          parentId: 1,
          image: "https://picsum.photos/seed/8dN3zhFo/3577/2103",
          translations: [
            {
              muscleGroupId: 6,
              language: "vi",
              name: "Trụ",
              normalizedName: "tru",
              slug: "tru",
            },
          ],
        },
      ],
      translations: [
        {
          exerciseId: 7,
          language: "vi",
          name: "Khâu xe biết mướn viết.",
          normalizedName: "khau xe biet muon viet",
          description:
            "Năm xuồng á bạn mây ghế. Nghỉ lầu tủ leo chìm hóa tôi. Yêu xe mua bàn.",
          slug: "khau-xe-biet-muon-viet",
        },
      ],
    },
    {
      id: 8,
      notes:
        "Delego cattus abundans. Admoneo cras confero doloribus. Tamquam antiquus vereor tandem cribro compono venustas sui urbanus voluptatibus.",
      category: "FREE_WEIGHT",
      createdById: 4,
      images: [
        "https://loremflickr.com/1252/3892?lock=6293660496290184",
        "https://loremflickr.com/58/2164?lock=6192566773398997",
        "https://picsum.photos/seed/WazAw2F3pR/255/2684",
      ],
      createdAt: "2025-04-11T14:09:26.115Z",
      updatedAt: "2025-04-11T14:09:26.507Z",
      workoutId: 38,
      primaryMuscle: [
        {
          id: 7,
          parentId: 1,
          image: "https://picsum.photos/seed/xoZwkh6cT/3488/1234",
          translations: [
            {
              muscleGroupId: 7,
              language: "vi",
              name: "Lát",
              normalizedName: "lat",
              slug: "lat",
            },
          ],
        },
      ],
      translations: [
        {
          exerciseId: 8,
          language: "vi",
          name: "Được giết lầu mây lầu núi thương bảy.",
          normalizedName: "duoc giet lau may lau nui thuong bay",
          description:
            "Bảy mua bốn ghế làm thế. Mướn vàng chín đá đập tôi nón núi. Lầu ác anh áo tô tui kim yêu ruộng đá.",
          slug: "duoc-giet-lau-may-lau-nui-thuong-bay",
        },
      ],
    },
    {
      id: 9,
      notes:
        "Aeger thesaurus cupio commemoro auxilium statim ea curia appositus trans. Tertius tredecim quia cunctatio voluntarius tempora. Cito assentator cedo stabilis consuasor demonstro hic cruentus aestivus.",
      category: "WEIGHT",
      createdById: 6,
      images: [
        "https://picsum.photos/seed/ccRWcc8X/3032/2548",
        "https://loremflickr.com/3640/380?lock=4350107339369992",
        "https://picsum.photos/seed/cFqoNP/3880/3988",
      ],
      createdAt: "2025-04-11T14:09:26.118Z",
      updatedAt: "2025-04-11T14:09:26.478Z",
      workoutId: 22,
      primaryMuscle: [
        {
          id: 9,
          parentId: 1,
          image: "https://picsum.photos/seed/OPlXKxNQ/2310/1686",
          translations: [
            {
              muscleGroupId: 9,
              language: "vi",
              name: "Lưng dưới",
              normalizedName: "lung duoi",
              slug: "lung-duoi",
            },
          ],
        },
      ],
      translations: [
        {
          exerciseId: 9,
          language: "vi",
          name: "Bàn anh cái tôi vá dép biết hàng đồng đánh.",
          normalizedName: "ban anh cai toi va dep biet hang dong danh",
          description:
            "Hóa chín năm tám trăng hóa bàn thuyền thì. Việc thì bơi nước áo kim phá. Quê yêu việc nón anh đập thương nghỉ.",
          slug: "ban-anh-cai-toi-va-dep-biet-hang-dong-danh",
        },
      ],
    },
    {
      id: 10,
      notes:
        "Dedecor audentia adsum deleniti defleo doloribus. Bene amet adiuvo. Comparo adimpleo ater verbum anser illum vobis laborum.",
      category: "FREE_WEIGHT",
      createdById: 1,
      images: [
        "https://loremflickr.com/3861/2516?lock=4980670739764559",
        "https://picsum.photos/seed/ZumH5ESf4X/2673/2991",
        "https://picsum.photos/seed/S0Ku3QOBrW/3957/1187",
      ],
      createdAt: "2025-04-11T14:09:26.121Z",
      updatedAt: "2025-04-11T14:09:26.527Z",
      workoutId: 49,
      primaryMuscle: [
        {
          id: 1,
          parentId: null,
          image: "https://loremflickr.com/908/3873?lock=4231754171829986",
          translations: [
            {
              muscleGroupId: 1,
              language: "vi",
              name: "Thân trên",
              normalizedName: "than tren",
              slug: "than-tren",
            },
          ],
        },
      ],
      translations: [
        {
          exerciseId: 10,
          language: "vi",
          name: "Nhà ngọt tám thuê.",
          normalizedName: "nha ngot tam thue",
          description: "Đâu ác á. Trời ghét mua ghét gió. Chết bảy nghỉ.",
          slug: "nha-ngot-tam-thue",
        },
      ],
    },
  ],
  meta: {
    total: 100,
    lastPage: 10,
    currentPage: 1,
    perPage: 10,
    prevPage: null,
    nextPage: 2,
  },
  version: "0.1.1",
};
const exercisePage2 = {
  data: [
    {
      id: 11,
      notes:
        "Fugiat congregatio acies correptius alienus volaticus civis cursim dedecor complectus. Denuncio aestus nostrum attonbitus amissio vorago stillicidium teres vobis. Pel anser denuo creber.",
      category: "FREE_WEIGHT",
      createdById: 12,
      images: [
        "https://picsum.photos/seed/lvHwI/1186/1044",
        "https://loremflickr.com/563/3434?lock=8000186865932166",
        "https://loremflickr.com/3244/1512?lock=4633132384160200",
      ],
      createdAt: "2025-04-11T14:09:26.124Z",
      updatedAt: "2025-04-11T14:09:26.515Z",
      workoutId: 41,
      primaryMuscle: [
        {
          id: 2,
          parentId: null,
          image: "https://loremflickr.com/2583/1708?lock=4437472374622822",
          translations: [
            {
              muscleGroupId: 2,
              language: "vi",
              name: "Thân dưới",
              normalizedName: "than duoi",
              slug: "than-duoi",
            },
          ],
        },
      ],
      translations: [
        {
          exerciseId: 11,
          language: "vi",
          name: "Sáu bơi giày chín.",
          normalizedName: "sau boi giay chin",
          description:
            "Nón hàng tui gió tô ruộng bạn phá. Viết yêu đồng xanh máy hai bơi bảy con. Lỗi nón lầu tàu giày á xuồng lầu.",
          slug: "sau-boi-giay-chin",
        },
      ],
    },
    {
      id: 12,
      notes:
        "Vacuus testimonium cupressus adulatio toties repellendus timidus templum. Autem deprimo vel possimus facilis corporis. Autus quos unus super utilis constans deripio comprehendo quis.",
      category: "WEIGHT",
      createdById: 8,
      images: [
        "https://loremflickr.com/802/2439?lock=1113762107037174",
        "https://loremflickr.com/3567/204?lock=629612825435162",
        "https://loremflickr.com/3077/1415?lock=8810702462716524",
      ],
      createdAt: "2025-04-11T14:09:26.127Z",
      updatedAt: "2025-04-11T14:09:26.127Z",
      workoutId: null,
      primaryMuscle: [
        {
          id: 2,
          parentId: null,
          image: "https://loremflickr.com/2583/1708?lock=4437472374622822",
          translations: [
            {
              muscleGroupId: 2,
              language: "vi",
              name: "Thân dưới",
              normalizedName: "than duoi",
              slug: "than-duoi",
            },
          ],
        },
      ],
      translations: [
        {
          exerciseId: 12,
          language: "vi",
          name: "Biển may mây tám tô núi bốn quê ngọt.",
          normalizedName: "bien may may tam to nui bon que ngot",
          description:
            "Mây thì năm nón dép. Ghế thuyền hàng đồng mây ngọt bè gió. Nón biết ác đạp phá tui vẽ đá nước.",
          slug: "bien-may-may-tam-to-nui-bon-que-ngot",
        },
      ],
    },
    {
      id: 13,
      notes:
        "Auctus abeo textilis. Adeo vetus decimus ab accommodo. Culpa angelus suus assentator cimentarius suffoco.",
      category: "FREE_WEIGHT",
      createdById: 9,
      images: [
        "https://loremflickr.com/3049/3357?lock=7243573115515002",
        "https://loremflickr.com/3661/2948?lock=564841338920813",
        "https://loremflickr.com/677/2002?lock=3416010822081915",
      ],
      createdAt: "2025-04-11T14:09:26.130Z",
      updatedAt: "2025-04-11T14:09:26.527Z",
      workoutId: 49,
      primaryMuscle: [
        {
          id: 4,
          parentId: 1,
          image: "https://picsum.photos/seed/oWFQPP/1088/2644",
          translations: [
            {
              muscleGroupId: 4,
              language: "vi",
              name: "Ngực",
              normalizedName: "nguc",
              slug: "nguc",
            },
          ],
        },
      ],
      translations: [
        {
          exerciseId: 13,
          language: "vi",
          name: "Nhà năm kim.",
          normalizedName: "nha nam kim",
          description:
            "Thuyền tôi đã làm nhà vá anh vẽ. Bảy thế ngọt thì tôi hóa bảy. Dép bảy tui.",
          slug: "nha-nam-kim",
        },
      ],
    },
    {
      id: 14,
      notes:
        "Ager crepusculum cernuus. Carmen textilis vinum. Adulescens adflicto apostolus cupiditas pel paulatim virtus corroboro ventosus.",
      category: "CARDIO",
      createdById: 5,
      images: [
        "https://loremflickr.com/3757/883?lock=5793383944504631",
        "https://picsum.photos/seed/oEh71Z/608/3712",
        "https://picsum.photos/seed/Gm6VM3VW/1103/2941",
      ],
      createdAt: "2025-04-11T14:09:26.133Z",
      updatedAt: "2025-04-11T14:09:26.478Z",
      workoutId: 22,
      primaryMuscle: [
        {
          id: 19,
          parentId: 2,
          image: "https://loremflickr.com/2445/2898?lock=7715086572119035",
          translations: [
            {
              muscleGroupId: 19,
              language: "vi",
              name: "Bắp chuối",
              normalizedName: "bap chuoi",
              slug: "bap-chuoi",
            },
          ],
        },
      ],
      translations: [
        {
          exerciseId: 14,
          language: "vi",
          name: "Thì hai tôi ác biển anh.",
          normalizedName: "thi hai toi ac bien anh",
          description:
            "Xanh thích nón hết chín biết ác đá hết khoan. Tủ lầu viết đạp thuê đang. Bảy ruộng một kim đang tím thuyền quần.",
          slug: "thi-hai-toi-ac-bien-anh",
        },
      ],
    },
    {
      id: 15,
      notes:
        "Tantum abutor timidus crebro solvo titulus. Veritas optio ocer. Tremo cimentarius cogo.",
      category: "CARDIO",
      createdById: 1,
      images: [
        "https://loremflickr.com/1323/2865?lock=3528959539140094",
        "https://loremflickr.com/2922/2807?lock=4712211850433584",
        "https://picsum.photos/seed/sltPezBT/3718/3304",
      ],
      createdAt: "2025-04-11T14:09:26.136Z",
      updatedAt: "2025-04-11T14:09:26.482Z",
      workoutId: 24,
      primaryMuscle: [
        {
          id: 15,
          parentId: 2,
          image: "https://picsum.photos/seed/kJGwn/1572/2267",
          translations: [
            {
              muscleGroupId: 15,
              language: "vi",
              name: "Bắp đùi",
              normalizedName: "bap dui",
              slug: "bap-dui",
            },
          ],
        },
      ],
      translations: [
        {
          exerciseId: 15,
          language: "vi",
          name: "Cái đá ừ phá con đạp đâu làm độc.",
          normalizedName: "cai da u pha con dap dau lam doc",
          description:
            "Thương khâu hết ruộng thôi khoảng núi anh. Đạp chìm quê trăng bảy ngọt nón nghỉ. Ba đạp con mây.",
          slug: "cai-da-u-pha-con-dap-dau-lam-doc",
        },
      ],
    },
    {
      id: 16,
      notes:
        "Cedo infit crebro utroque alias eaque blandior. Trucido consuasor asperiores adiuvo dolore alius. Cuppedia arbor magnam tabesco.",
      category: "CARDIO",
      createdById: 12,
      images: [
        "https://loremflickr.com/2724/222?lock=3947515225829566",
        "https://picsum.photos/seed/pP5hIh/1740/2891",
        "https://picsum.photos/seed/uXeuNSnE/3762/1577",
      ],
      createdAt: "2025-04-11T14:09:26.145Z",
      updatedAt: "2025-04-11T14:09:26.502Z",
      workoutId: 35,
      primaryMuscle: [
        {
          id: 19,
          parentId: 2,
          image: "https://loremflickr.com/2445/2898?lock=7715086572119035",
          translations: [
            {
              muscleGroupId: 19,
              language: "vi",
              name: "Bắp chuối",
              normalizedName: "bap chuoi",
              slug: "bap-chuoi",
            },
          ],
        },
      ],
      translations: [
        {
          exerciseId: 16,
          language: "vi",
          name: "Mua nhà khoan lỗi thôi nhà anh.",
          normalizedName: "mua nha khoan loi thoi nha anh",
          description:
            "Áo đá đang đang máy thương áo. Bè giết nón hương thương bơi tím thương đang đá. Hàng bơi cửa đạp được cửa.",
          slug: "mua-nha-khoan-loi-thoi-nha-anh",
        },
      ],
    },
    {
      id: 17,
      notes:
        "Usus cinis sequi tepidus. Conatus defluo adsidue maiores defendo atque. Utique amet crur libero.",
      category: "FREE_WEIGHT",
      createdById: 15,
      images: [
        "https://loremflickr.com/1015/1526?lock=977795693547282",
        "https://picsum.photos/seed/Cqpzn/3617/2411",
        "https://loremflickr.com/1897/2132?lock=7582443717282389",
      ],
      createdAt: "2025-04-11T14:09:26.148Z",
      updatedAt: "2025-04-11T14:09:26.528Z",
      workoutId: 50,
      primaryMuscle: [
        {
          id: 8,
          parentId: 1,
          image: "https://loremflickr.com/1349/3502?lock=7703903488261586",
          translations: [
            {
              muscleGroupId: 8,
              language: "vi",
              name: "Lưng giữa",
              normalizedName: "lung giua",
              slug: "lung-giua",
            },
          ],
        },
      ],
      translations: [
        {
          exerciseId: 17,
          language: "vi",
          name: "Trời hai tô hàng.",
          normalizedName: "troi hai to hang",
          description:
            "May chìm ghế ghế gió xe hóa. Vá bè việc chìm thì lỗi gió. Yêu biết xuồng ruộng gì mướn tàu.",
          slug: "troi-hai-to-hang",
        },
      ],
    },
    {
      id: 18,
      notes:
        "Consuasor cernuus verbera absorbeo concedo curso veritatis vergo fugiat. Appello arma tamdiu conturbo cito eveniet ars aestas. Cupiditas cresco quaerat cupiditas candidus accendo creator.",
      category: "FREE_WEIGHT",
      createdById: 3,
      images: [
        "https://picsum.photos/seed/nWR8XWuSmi/2894/1193",
        "https://loremflickr.com/3651/2338?lock=988263123807035",
        "https://picsum.photos/seed/PIxUeo/3097/2244",
      ],
      createdAt: "2025-04-11T14:09:26.150Z",
      updatedAt: "2025-04-11T14:09:26.508Z",
      workoutId: 39,
      primaryMuscle: [
        {
          id: 10,
          parentId: 1,
          image: "https://picsum.photos/seed/FiatIVIFLp/1640/1153",
          translations: [
            {
              muscleGroupId: 10,
              language: "vi",
              name: "Bắp tay trước",
              normalizedName: "bap tay truoc",
              slug: "bap-tay-truoc",
            },
          ],
        },
      ],
      translations: [
        {
          exerciseId: 18,
          language: "vi",
          name: "Cái phá xuồng hết.",
          normalizedName: "cai pha xuong het",
          description:
            "Khoan là đỏ chết ác yêu được. Đánh sáu thuê ờ máy tui việc. Độc vẽ khoan.",
          slug: "cai-pha-xuong-het",
        },
      ],
    },
    {
      id: 19,
      notes:
        "Celo vinculum demoror canis bis porro cibo tres cunae. Derideo audax odio nesciunt corpus audax conculco. Speciosus amiculum perferendis vicissitudo videlicet.",
      category: "CARDIO",
      createdById: 6,
      images: [
        "https://loremflickr.com/3864/3123?lock=4800376963716944",
        "https://loremflickr.com/2588/215?lock=7035053375573937",
        "https://loremflickr.com/735/3596?lock=4136454250445833",
      ],
      createdAt: "2025-04-11T14:09:26.154Z",
      updatedAt: "2025-04-11T14:09:26.484Z",
      workoutId: 25,
      primaryMuscle: [
        {
          id: 1,
          parentId: null,
          image: "https://loremflickr.com/908/3873?lock=4231754171829986",
          translations: [
            {
              muscleGroupId: 1,
              language: "vi",
              name: "Thân trên",
              normalizedName: "than tren",
              slug: "than-tren",
            },
          ],
        },
      ],
      translations: [
        {
          exerciseId: 19,
          language: "vi",
          name: "Ờ việc thế anh hóa thuê phá.",
          normalizedName: "o viec the anh hoa thue pha",
          description:
            "Tô mười nhà được tủ đá ác. Thì đánh may không. Hóa may cửa vẽ vá đang.",
          slug: "o-viec-the-anh-hoa-thue-pha",
        },
      ],
    },
    {
      id: 20,
      notes:
        "Conculco vix crapula utrimque denuncio cognomen ipsa teres cervus. Ara thymbra volaticus cupiditas facilis terga alii clamo vigilo. Demergo usitas auctus mollitia ab.",
      category: "WEIGHT",
      createdById: 14,
      images: [
        "https://picsum.photos/seed/ld0NGo217/3589/106",
        "https://picsum.photos/seed/gOhOTIBhm/1205/749",
        "https://picsum.photos/seed/STV0wp/3320/873",
      ],
      createdAt: "2025-04-11T14:09:26.156Z",
      updatedAt: "2025-04-11T14:09:26.518Z",
      workoutId: 43,
      primaryMuscle: [
        {
          id: 19,
          parentId: 2,
          image: "https://loremflickr.com/2445/2898?lock=7715086572119035",
          translations: [
            {
              muscleGroupId: 19,
              language: "vi",
              name: "Bắp chuối",
              normalizedName: "bap chuoi",
              slug: "bap-chuoi",
            },
          ],
        },
      ],
      translations: [
        {
          exerciseId: 20,
          language: "vi",
          name: "Đỏ quê thương đánh mướn đâu hết không mướn việc.",
          normalizedName: "do que thuong danh muon dau het khong muon viec",
          description:
            "Nghỉ đồng mướn. Bảy á mây viết ba mười gì đâu bàn quần. Xe không tô anh lỗi tôi làm đã cửa.",
          slug: "do-que-thuong-danh-muon-dau-het-khong-muon-viec",
        },
      ],
    },
  ],
  meta: {
    total: 100,
    lastPage: 10,
    currentPage: 2,
    perPage: 10,
    prevPage: 1,
    nextPage: 3,
  },
  version: "0.1.1",
};
const muscleGroups = [
  {
    id: 1,
    parentId: null,
    image: "https://loremflickr.com/908/3873?lock=4231754171829986",
    translations: [
      {
        muscleGroupId: 1,
        language: "vi",
        name: "Thân trên",
        normalizedName: "than tren",
        slug: "than-tren",
      },
    ],
  },
  {
    id: 2,
    parentId: null,
    image: "https://loremflickr.com/2583/1708?lock=4437472374622822",
    translations: [
      {
        muscleGroupId: 2,
        language: "vi",
        name: "Thân dưới",
        normalizedName: "than duoi",
        slug: "than-duoi",
      },
    ],
  },
  {
    id: 3,
    parentId: null,
    image: "https://picsum.photos/seed/rL1q3l8g/196/533",
    translations: [
      {
        muscleGroupId: 3,
        language: "vi",
        name: "Khác",
        normalizedName: "khac",
        slug: "khac",
      },
    ],
  },
  {
    id: 4,
    parentId: 1,
    image: "https://picsum.photos/seed/oWFQPP/1088/2644",
    translations: [
      {
        muscleGroupId: 4,
        language: "vi",
        name: "Ngực",
        normalizedName: "nguc",
        slug: "nguc",
      },
    ],
  },
  {
    id: 5,
    parentId: 1,
    image: "https://loremflickr.com/2794/2866?lock=2321216307360319",
    translations: [
      {
        muscleGroupId: 5,
        language: "vi",
        name: "Vai",
        normalizedName: "vai",
        slug: "vai",
      },
    ],
  },
  {
    id: 6,
    parentId: 1,
    image: "https://picsum.photos/seed/8dN3zhFo/3577/2103",
    translations: [
      {
        muscleGroupId: 6,
        language: "vi",
        name: "Trụ",
        normalizedName: "tru",
        slug: "tru",
      },
    ],
  },
  {
    id: 7,
    parentId: 1,
    image: "https://picsum.photos/seed/xoZwkh6cT/3488/1234",
    translations: [
      {
        muscleGroupId: 7,
        language: "vi",
        name: "Lát",
        normalizedName: "lat",
        slug: "lat",
      },
    ],
  },
  {
    id: 8,
    parentId: 1,
    image: "https://loremflickr.com/1349/3502?lock=7703903488261586",
    translations: [
      {
        muscleGroupId: 8,
        language: "vi",
        name: "Lưng giữa",
        normalizedName: "lung giua",
        slug: "lung-giua",
      },
    ],
  },
  {
    id: 9,
    parentId: 1,
    image: "https://picsum.photos/seed/OPlXKxNQ/2310/1686",
    translations: [
      {
        muscleGroupId: 9,
        language: "vi",
        name: "Lưng dưới",
        normalizedName: "lung duoi",
        slug: "lung-duoi",
      },
    ],
  },
  {
    id: 10,
    parentId: 1,
    image: "https://picsum.photos/seed/FiatIVIFLp/1640/1153",
    translations: [
      {
        muscleGroupId: 10,
        language: "vi",
        name: "Bắp tay trước",
        normalizedName: "bap tay truoc",
        slug: "bap-tay-truoc",
      },
    ],
  },
  {
    id: 11,
    parentId: 1,
    image: "https://loremflickr.com/1225/785?lock=1579493073211213",
    translations: [
      {
        muscleGroupId: 11,
        language: "vi",
        name: "Bắp tay sau",
        normalizedName: "bap tay sau",
        slug: "bap-tay-sau",
      },
    ],
  },
  {
    id: 12,
    parentId: 1,
    image: "https://loremflickr.com/1139/1835?lock=4665060384927982",
    translations: [
      {
        muscleGroupId: 12,
        language: "vi",
        name: "Cẳng tay",
        normalizedName: "cang tay",
        slug: "cang-tay",
      },
    ],
  },
  {
    id: 13,
    parentId: 1,
    image: "https://loremflickr.com/2908/901?lock=2679988289024639",
    translations: [
      {
        muscleGroupId: 13,
        language: "vi",
        name: "Bụng",
        normalizedName: "bung",
        slug: "bung",
      },
    ],
  },
  {
    id: 14,
    parentId: 2,
    image: "https://loremflickr.com/200/508?lock=3187551841336476",
    translations: [
      {
        muscleGroupId: 14,
        language: "vi",
        name: "Bắp chân",
        normalizedName: "bap chan",
        slug: "bap-chan",
      },
    ],
  },
  {
    id: 15,
    parentId: 2,
    image: "https://picsum.photos/seed/kJGwn/1572/2267",
    translations: [
      {
        muscleGroupId: 15,
        language: "vi",
        name: "Bắp đùi",
        normalizedName: "bap dui",
        slug: "bap-dui",
      },
    ],
  },
  {
    id: 16,
    parentId: 2,
    image: "https://picsum.photos/seed/yNtFgHU/379/536",
    translations: [
      {
        muscleGroupId: 16,
        language: "vi",
        name: "Bắp mông",
        normalizedName: "bap mong",
        slug: "bap-mong",
      },
    ],
  },
  {
    id: 17,
    parentId: 2,
    image: "https://loremflickr.com/996/3969?lock=5278495595077502",
    translations: [
      {
        muscleGroupId: 17,
        language: "vi",
        name: "Bắp hang",
        normalizedName: "bap hang",
        slug: "bap-hang",
      },
    ],
  },
  {
    id: 18,
    parentId: 2,
    image: "https://loremflickr.com/3085/3156?lock=3144129950477851",
    translations: [
      {
        muscleGroupId: 18,
        language: "vi",
        name: "Bắp mông giữa",
        normalizedName: "bap mong giua",
        slug: "bap-mong-giua",
      },
    ],
  },
  {
    id: 19,
    parentId: 2,
    image: "https://loremflickr.com/2445/2898?lock=7715086572119035",
    translations: [
      {
        muscleGroupId: 19,
        language: "vi",
        name: "Bắp chuối",
        normalizedName: "bap chuoi",
        slug: "bap-chuoi",
      },
    ],
  },
  {
    id: 20,
    parentId: 3,
    image: "https://picsum.photos/seed/SbjoM8cj/2556/2307",
    translations: [
      {
        muscleGroupId: 20,
        language: "vi",
        name: "Sức bền",
        normalizedName: "suc ben",
        slug: "suc-ben",
      },
    ],
  },
];
// search=danh
const exercisesWithSearchEqualDanh = {
  data: [
    {
      id: 9,
      notes:
        "Aeger thesaurus cupio commemoro auxilium statim ea curia appositus trans. Tertius tredecim quia cunctatio voluntarius tempora. Cito assentator cedo stabilis consuasor demonstro hic cruentus aestivus.",
      category: "WEIGHT",
      createdById: 6,
      images: [
        "https://picsum.photos/seed/ccRWcc8X/3032/2548",
        "https://loremflickr.com/3640/380?lock=4350107339369992",
        "https://picsum.photos/seed/cFqoNP/3880/3988",
      ],
      createdAt: "2025-04-11T14:09:26.118Z",
      updatedAt: "2025-04-11T14:09:26.478Z",
      workoutId: 22,
      primaryMuscle: [
        {
          id: 9,
          parentId: 1,
          image: "https://picsum.photos/seed/OPlXKxNQ/2310/1686",
          translations: [
            {
              muscleGroupId: 9,
              language: "vi",
              name: "Lưng dưới",
              normalizedName: "lung duoi",
              slug: "lung-duoi",
            },
          ],
        },
      ],
      translations: [
        {
          exerciseId: 9,
          language: "vi",
          name: "Bàn anh cái tôi vá dép biết hàng đồng đánh.",
          normalizedName: "ban anh cai toi va dep biet hang dong danh",
          description:
            "Hóa chín năm tám trăng hóa bàn thuyền thì. Việc thì bơi nước áo kim phá. Quê yêu việc nón anh đập thương nghỉ.",
          slug: "ban-anh-cai-toi-va-dep-biet-hang-dong-danh",
        },
      ],
    },
    {
      id: 20,
      notes:
        "Conculco vix crapula utrimque denuncio cognomen ipsa teres cervus. Ara thymbra volaticus cupiditas facilis terga alii clamo vigilo. Demergo usitas auctus mollitia ab.",
      category: "WEIGHT",
      createdById: 14,
      images: [
        "https://picsum.photos/seed/ld0NGo217/3589/106",
        "https://picsum.photos/seed/gOhOTIBhm/1205/749",
        "https://picsum.photos/seed/STV0wp/3320/873",
      ],
      createdAt: "2025-04-11T14:09:26.156Z",
      updatedAt: "2025-04-11T14:09:26.518Z",
      workoutId: 43,
      primaryMuscle: [
        {
          id: 19,
          parentId: 2,
          image: "https://loremflickr.com/2445/2898?lock=7715086572119035",
          translations: [
            {
              muscleGroupId: 19,
              language: "vi",
              name: "Bắp chuối",
              normalizedName: "bap chuoi",
              slug: "bap-chuoi",
            },
          ],
        },
      ],
      translations: [
        {
          exerciseId: 20,
          language: "vi",
          name: "Đỏ quê thương đánh mướn đâu hết không mướn việc.",
          normalizedName: "do que thuong danh muon dau het khong muon viec",
          description:
            "Nghỉ đồng mướn. Bảy á mây viết ba mười gì đâu bàn quần. Xe không tô anh lỗi tôi làm đã cửa.",
          slug: "do-que-thuong-danh-muon-dau-het-khong-muon-viec",
        },
      ],
    },
    {
      id: 24,
      notes:
        "Aureus optio causa virtus alo damnatio amet allatus. Ambulo depraedor officiis. Tres certe titulus sufficio cupio statua cohors.",
      category: "WEIGHT",
      createdById: 9,
      images: [
        "https://picsum.photos/seed/KxKoJk/653/1847",
        "https://loremflickr.com/3745/2978?lock=4944685811612885",
        "https://picsum.photos/seed/KNx5GRAt/3027/2967",
      ],
      createdAt: "2025-04-11T14:09:26.168Z",
      updatedAt: "2025-04-11T14:09:26.516Z",
      workoutId: 42,
      primaryMuscle: [
        {
          id: 12,
          parentId: 1,
          image: "https://loremflickr.com/1139/1835?lock=4665060384927982",
          translations: [
            {
              muscleGroupId: 12,
              language: "vi",
              name: "Cẳng tay",
              normalizedName: "cang tay",
              slug: "cang-tay",
            },
          ],
        },
      ],
      translations: [
        {
          exerciseId: 24,
          language: "vi",
          name: "Đánh mượn may.",
          normalizedName: "danh muon may",
          description:
            "Việc leo đã tủ. Bảy biết giết xanh. Kim không khoảng xanh bơi hai.",
          slug: "danh-muon-may",
        },
      ],
    },
    {
      id: 26,
      notes:
        "Velociter desino vir. Artificiose socius patria tenax urbs aliqua corrumpo. Nihil defendo a ver dedecor trado bis.",
      category: "WEIGHT",
      createdById: 12,
      images: [
        "https://picsum.photos/seed/7si5y/2335/868",
        "https://picsum.photos/seed/UEkCft/1811/1697",
        "https://picsum.photos/seed/79aS5Bk/3550/1492",
      ],
      createdAt: "2025-04-11T14:09:26.174Z",
      updatedAt: "2025-04-11T14:09:26.524Z",
      workoutId: 47,
      primaryMuscle: [
        {
          id: 15,
          parentId: 2,
          image: "https://picsum.photos/seed/kJGwn/1572/2267",
          translations: [
            {
              muscleGroupId: 15,
              language: "vi",
              name: "Bắp đùi",
              normalizedName: "bap dui",
              slug: "bap-dui",
            },
          ],
        },
      ],
      translations: [
        {
          exerciseId: 26,
          language: "vi",
          name: "Đánh mướn khoan độc bạn.",
          normalizedName: "danh muon khoan doc ban",
          description:
            "Leo dép tui bơi bốn em khâu đánh đập. Hết đã bốn em đỏ đá em. Mướn quê đang bạn trời thì thì tui thế.",
          slug: "danh-muon-khoan-doc-ban",
        },
      ],
    },
    {
      id: 27,
      notes:
        "Adipisci tenetur conicio tollo cultellus tertius animadverto. Ver comparo clarus demergo deleniti certus patrocinor trepide volup. Sed comes odio usus uterque termes carmen tenus causa.",
      category: "CARDIO",
      createdById: 5,
      images: [
        "https://picsum.photos/seed/7baK5HV/3002/2462",
        "https://picsum.photos/seed/QKCgS8/3155/376",
        "https://picsum.photos/seed/8oitcJLl/3353/2691",
      ],
      createdAt: "2025-04-11T14:09:26.177Z",
      updatedAt: "2025-04-11T14:09:26.502Z",
      workoutId: 35,
      primaryMuscle: [
        {
          id: 14,
          parentId: 2,
          image: "https://loremflickr.com/200/508?lock=3187551841336476",
          translations: [
            {
              muscleGroupId: 14,
              language: "vi",
              name: "Bắp chân",
              normalizedName: "bap chan",
              slug: "bap-chan",
            },
          ],
        },
      ],
      translations: [
        {
          exerciseId: 27,
          language: "vi",
          name: "Hàng việc ác cửa bơi thì nón đánh núi.",
          normalizedName: "hang viec ac cua boi thi non danh nui",
          description:
            "Thôi tám đập đỏ đá trời. Đang đạp em nha giết. Tàu bè mướn tô may.",
          slug: "hang-viec-ac-cua-boi-thi-non-danh-nui",
        },
      ],
    },
    {
      id: 58,
      notes:
        "Conspergo ex curis cognatus magni tenax. Conculco trans barba assumenda. Desipio pecco vivo aliqua accusamus summopere ultio baiulus.",
      category: "CARDIO",
      createdById: 8,
      images: [
        "https://picsum.photos/seed/vnuk5/1325/53",
        "https://loremflickr.com/2985/2496?lock=2990177557495901",
        "https://picsum.photos/seed/f2kSfn5I/1173/59",
      ],
      createdAt: "2025-04-11T14:09:26.260Z",
      updatedAt: "2025-04-11T14:09:26.522Z",
      workoutId: 46,
      primaryMuscle: [
        {
          id: 11,
          parentId: 1,
          image: "https://loremflickr.com/1225/785?lock=1579493073211213",
          translations: [
            {
              muscleGroupId: 11,
              language: "vi",
              name: "Bắp tay sau",
              normalizedName: "bap tay sau",
              slug: "bap-tay-sau",
            },
          ],
        },
      ],
      translations: [
        {
          exerciseId: 58,
          language: "vi",
          name: "Hết đánh thuyền tôi.",
          normalizedName: "het danh thuyen toi",
          description:
            "Mướn ruộng tím thế đạp bảy. Xanh tui một ngọt leo. Vẽ biết giết đá tàu anh mua ba.",
          slug: "het-danh-thuyen-toi",
        },
      ],
    },
    {
      id: 62,
      notes:
        "Dolorem baiulus universe cibus deleniti viscus. Fugit dens terga caveo paens. Maiores animi vetus turbo arto.",
      category: "FREE_WEIGHT",
      createdById: 11,
      images: [
        "https://loremflickr.com/2080/1939?lock=56939463750278",
        "https://picsum.photos/seed/bfwqtfPV6/1581/954",
        "https://picsum.photos/seed/YbfocJ2B/1809/1863",
      ],
      createdAt: "2025-04-11T14:09:26.274Z",
      updatedAt: "2025-04-11T14:09:26.513Z",
      workoutId: 40,
      primaryMuscle: [
        {
          id: 11,
          parentId: 1,
          image: "https://loremflickr.com/1225/785?lock=1579493073211213",
          translations: [
            {
              muscleGroupId: 11,
              language: "vi",
              name: "Bắp tay sau",
              normalizedName: "bap tay sau",
              slug: "bap-tay-sau",
            },
          ],
        },
      ],
      translations: [
        {
          exerciseId: 62,
          language: "vi",
          name: "Núi đâu đánh làm may giết.",
          normalizedName: "nui dau danh lam may giet",
          description:
            "Năm em thuê áo xuồng tủ là. Trời vẽ việc mướn. Tôi biết viết quê hết tủ leo em.",
          slug: "nui-dau-danh-lam-may-giet",
        },
      ],
    },
    {
      id: 100,
      notes:
        "Arbustum curiositas venia deprecator attollo. Placeat non accusator trans ustilo quae perspiciatis. Stella beneficium conservo damnatio denuo delectus deorsum ultra coaegresco virga.",
      category: "WEIGHT",
      createdById: 1,
      images: [
        "https://loremflickr.com/1893/644?lock=4178657118828213",
        "https://loremflickr.com/3785/1472?lock=4904387790722",
        "https://loremflickr.com/3387/3562?lock=7265816121234189",
      ],
      createdAt: "2025-04-11T14:09:26.362Z",
      updatedAt: "2025-04-11T14:09:26.518Z",
      workoutId: 43,
      primaryMuscle: [
        {
          id: 17,
          parentId: 2,
          image: "https://loremflickr.com/996/3969?lock=5278495595077502",
          translations: [
            {
              muscleGroupId: 17,
              language: "vi",
              name: "Bắp hang",
              normalizedName: "bap hang",
              slug: "bap-hang",
            },
          ],
        },
      ],
      translations: [
        {
          exerciseId: 100,
          language: "vi",
          name: "Hết đánh ngọt.",
          normalizedName: "het danh ngot",
          description: "Thuyền anh may. Tủ hóa bơi tàu. Lầu hết gió hết.",
          slug: "het-danh-ngot",
        },
      ],
    },
  ],
  meta: {
    total: 8,
    lastPage: 1,
    currentPage: 1,
    perPage: 10,
    prevPage: null,
    nextPage: null,
  },
  version: "0.1.1",
};

const exercisesOfChestMuscleGroup = {
  data: [
    {
      id: 4,
      notes:
        "Ut dolorem contabesco comes uredo creator. Terminatio usitas hic nulla vorax curia nobis amplitudo quidem. Atqui agnitio timidus cribro.",
      category: "CARDIO",
      createdById: 3,
      images: [
        "https://loremflickr.com/2025/2330?lock=1404547483301774",
        "https://picsum.photos/seed/CBT3xaZ/1296/757",
        "https://picsum.photos/seed/sfnkTXmTS/2950/3676",
      ],
      createdAt: "2025-04-11T14:09:26.104Z",
      updatedAt: "2025-04-11T14:09:26.521Z",
      workoutId: 45,
      primaryMuscle: [
        {
          id: 4,
          parentId: 1,
          image: "https://picsum.photos/seed/oWFQPP/1088/2644",
          translations: [
            {
              muscleGroupId: 4,
              language: "vi",
              name: "Ngực",
              normalizedName: "nguc",
              slug: "nguc",
            },
          ],
        },
      ],
      translations: [
        {
          exerciseId: 4,
          language: "vi",
          name: "Ừ ghế ác.",
          normalizedName: "u ghe ac",
          description:
            "Làm ừ thích nha làm khoảng tui bè tôi xe. Ừ đạp vẽ không nghỉ. Dép tui vẽ nha bảy.",
          slug: "u-ghe-ac",
        },
      ],
    },
    {
      id: 13,
      notes:
        "Auctus abeo textilis. Adeo vetus decimus ab accommodo. Culpa angelus suus assentator cimentarius suffoco.",
      category: "FREE_WEIGHT",
      createdById: 9,
      images: [
        "https://loremflickr.com/3049/3357?lock=7243573115515002",
        "https://loremflickr.com/3661/2948?lock=564841338920813",
        "https://loremflickr.com/677/2002?lock=3416010822081915",
      ],
      createdAt: "2025-04-11T14:09:26.130Z",
      updatedAt: "2025-04-11T14:09:26.527Z",
      workoutId: 49,
      primaryMuscle: [
        {
          id: 4,
          parentId: 1,
          image: "https://picsum.photos/seed/oWFQPP/1088/2644",
          translations: [
            {
              muscleGroupId: 4,
              language: "vi",
              name: "Ngực",
              normalizedName: "nguc",
              slug: "nguc",
            },
          ],
        },
      ],
      translations: [
        {
          exerciseId: 13,
          language: "vi",
          name: "Nhà năm kim.",
          normalizedName: "nha nam kim",
          description:
            "Thuyền tôi đã làm nhà vá anh vẽ. Bảy thế ngọt thì tôi hóa bảy. Dép bảy tui.",
          slug: "nha-nam-kim",
        },
      ],
    },
    {
      id: 32,
      notes:
        "Comis admitto subvenio velut eius. Caelum numquam abundans umerus alias demulceo totidem. Decor aperiam socius voveo subito magni.",
      category: "WEIGHT",
      createdById: 8,
      images: [
        "https://loremflickr.com/3338/1884?lock=3168280457272442",
        "https://picsum.photos/seed/pyHsY/2915/1844",
        "https://loremflickr.com/2799/36?lock=4561818198824934",
      ],
      createdAt: "2025-04-11T14:09:26.189Z",
      updatedAt: "2025-04-11T14:09:26.518Z",
      workoutId: 43,
      primaryMuscle: [
        {
          id: 4,
          parentId: 1,
          image: "https://picsum.photos/seed/oWFQPP/1088/2644",
          translations: [
            {
              muscleGroupId: 4,
              language: "vi",
              name: "Ngực",
              normalizedName: "nguc",
              slug: "nguc",
            },
          ],
        },
      ],
      translations: [
        {
          exerciseId: 32,
          language: "vi",
          name: "Bốn mượn ờ anh.",
          normalizedName: "bon muon o anh",
          description:
            "Nha giày yêu xuồng viết đá đã năm mua. Vàng tô trời hóa lỗi. Xe cửa đồng đã.",
          slug: "bon-muon-o-anh",
        },
      ],
    },
    {
      id: 37,
      notes:
        "Adaugeo cohibeo deficio vereor tener contra itaque. Sui incidunt thymbra audacia laborum. Cito caelum adfectus comminor defendo corroboro annus clam thesaurus.",
      category: "FREE_WEIGHT",
      createdById: 5,
      images: [
        "https://picsum.photos/seed/3ehOwZx/816/3442",
        "https://loremflickr.com/2361/3372?lock=3826065439122477",
        "https://loremflickr.com/3089/1128?lock=2988762898373619",
      ],
      createdAt: "2025-04-11T14:09:26.202Z",
      updatedAt: "2025-04-11T14:09:26.513Z",
      workoutId: 40,
      primaryMuscle: [
        {
          id: 4,
          parentId: 1,
          image: "https://picsum.photos/seed/oWFQPP/1088/2644",
          translations: [
            {
              muscleGroupId: 4,
              language: "vi",
              name: "Ngực",
              normalizedName: "nguc",
              slug: "nguc",
            },
          ],
        },
      ],
      translations: [
        {
          exerciseId: 37,
          language: "vi",
          name: "Áo đang thì ba.",
          normalizedName: "ao dang thi ba",
          description:
            "Em leo chỉ ừ tám chìm mây chìm tôi may. Gió á hàng tôi chìm. Vàng đỏ leo.",
          slug: "ao-dang-thi-ba",
        },
      ],
    },
    {
      id: 55,
      notes:
        "Conservo celer aegrotatio subito adversus capio adflicto. Spes amiculum corroboro conitor alo comis uxor tubineus talio. Vomica aequitas trepide eius modi sono textor distinctio natus.",
      category: "WEIGHT",
      createdById: 5,
      images: [
        "https://loremflickr.com/3753/251?lock=1997064754638839",
        "https://picsum.photos/seed/YQpK9C/507/2464",
        "https://picsum.photos/seed/wyCsU1/3225/376",
      ],
      createdAt: "2025-04-11T14:09:26.251Z",
      updatedAt: "2025-04-11T14:09:26.515Z",
      workoutId: 41,
      primaryMuscle: [
        {
          id: 4,
          parentId: 1,
          image: "https://picsum.photos/seed/oWFQPP/1088/2644",
          translations: [
            {
              muscleGroupId: 4,
              language: "vi",
              name: "Ngực",
              normalizedName: "nguc",
              slug: "nguc",
            },
          ],
        },
      ],
      translations: [
        {
          exerciseId: 55,
          language: "vi",
          name: "Lỗi tím nghỉ đang con anh mượn đỏ hàng.",
          normalizedName: "loi tim nghi dang con anh muon do hang",
          description:
            "Mây chỉ quần không trời ờ việc giày đá. Hương bè thuyền tui trời xanh nha. Đồng một mười thuê bốn thế lầu chết ruộng tui.",
          slug: "loi-tim-nghi-dang-con-anh-muon-do-hang",
        },
      ],
    },
    {
      id: 63,
      notes:
        "Voluptate tristis cibus sustineo. Corrupti avarus deputo. Deporto congregatio consectetur crapula degenero adipiscor alius bellicus.",
      category: "FREE_WEIGHT",
      createdById: 11,
      images: [
        "https://loremflickr.com/2361/1154?lock=1867802813301916",
        "https://loremflickr.com/1664/49?lock=1881702369559990",
        "https://picsum.photos/seed/zksKFO/1224/236",
      ],
      createdAt: "2025-04-11T14:09:26.277Z",
      updatedAt: "2025-04-11T14:09:26.467Z",
      workoutId: 16,
      primaryMuscle: [
        {
          id: 4,
          parentId: 1,
          image: "https://picsum.photos/seed/oWFQPP/1088/2644",
          translations: [
            {
              muscleGroupId: 4,
              language: "vi",
              name: "Ngực",
              normalizedName: "nguc",
              slug: "nguc",
            },
          ],
        },
      ],
      translations: [
        {
          exerciseId: 63,
          language: "vi",
          name: "Chết thuyền nhà hóa.",
          normalizedName: "chet thuyen nha hoa",
          description:
            "Tô viết cái trời mượn khoảng. Quê nha lầu nhà vẽ trăng. Ghế phá ác giày tím vàng đỏ.",
          slug: "chet-thuyen-nha-hoa",
        },
      ],
    },
    {
      id: 95,
      notes:
        "Caelum subnecto ea. Argentum undique cunabula copiose carbo. Ciminatio crepusculum terga communis cubo voluptates.",
      category: "FREE_WEIGHT",
      createdById: 11,
      images: [
        "https://loremflickr.com/3418/2218?lock=639218584074630",
        "https://picsum.photos/seed/2JdAMUiHv/2153/2688",
        "https://picsum.photos/seed/YrvTu/3883/1560",
      ],
      createdAt: "2025-04-11T14:09:26.351Z",
      updatedAt: "2025-04-11T14:09:26.507Z",
      workoutId: 38,
      primaryMuscle: [
        {
          id: 4,
          parentId: 1,
          image: "https://picsum.photos/seed/oWFQPP/1088/2644",
          translations: [
            {
              muscleGroupId: 4,
              language: "vi",
              name: "Ngực",
              normalizedName: "nguc",
              slug: "nguc",
            },
          ],
        },
      ],
      translations: [
        {
          exerciseId: 95,
          language: "vi",
          name: "Ngọt ngọt tàu tui trăng.",
          normalizedName: "ngot ngot tau tui trang",
          description:
            "Hết thương cái. Việc thế anh. Khâu nghỉ độc thích được viết xanh hương quê một.",
          slug: "ngot-ngot-tau-tui-trang",
        },
      ],
    },
  ],
  meta: {
    total: 7,
    lastPage: 1,
    currentPage: 1,
    perPage: 10,
    prevPage: null,
    nextPage: null,
  },
  version: "0.1.1",
};

describe("ExercisesScreen", () => {
  it("should fetch new data on search", async () => {
    // Mock initial data fetch
    nock(ENV.API_URL)
      .get(API_ROUTES.exercises.query({ page: 1 }))
      .reply(200, exercisePage1);

    nock(ENV.API_URL).get(API_ROUTES.muscleGroups.query()).reply(200, {
      data: muscleGroups,
    });

    const { result } = customRenderInfiniteQueryHook<Exercise[]>((props) => {
      return useGetExercises({
        search: (props?.search || "") as string,
        muscleGroupId: undefined,
      });
    });

    customRenderUI(<ExercisesScreen />);

    // Wait for initial data to load
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data?.pages[0].data.length).toBe(10);
    });

    // Type in search input
    const searchInput = screen.getByTestId("search-input");
    const searchKeyword = "danh";
    nock(ENV.API_URL)
      .get(API_ROUTES.exercises.query({ page: 1, search: searchKeyword }))
      .reply(200, exercisesWithSearchEqualDanh);
    fireEvent.changeText(searchInput, searchKeyword);

    //! dont need rerender
    // Rerender the hook with new search term
    // rerender({ search: searchKeyword });
    // const mock1 = nock(ENV.API_URL)
    //   .get(API_ROUTES.exercises.query({ page: 1, search: searchKeyword }))
    //   .reply(200, exercisesWithSearchEqualDanh);

    await waitFor(() => {
      expect(result.current.isFetching).toBe(false);
      expect(screen.getAllByTestId(/exercise-item-\d+$/i).length).toBe(8);
      // Verify search results are displayed
      for (const exercise of exercisesWithSearchEqualDanh.data) {
        expect(
          screen.getByText(exercise.translations[0].name, { exact: false })
        ).toBeOnTheScreen();
      }
    });
  });

  it("should render and fetch data on scroll", async () => {
    nock(ENV.API_URL)
      .get(API_ROUTES.exercises.query({ page: 1 }))
      .reply(200, exercisePage1);
    nock(ENV.API_URL)
      .get(API_ROUTES.exercises.query({ page: 2 }))
      .reply(200, exercisePage2);

    const { result } = customRenderInfiniteQueryHook<Exercise[]>(() =>
      useGetExercises({ search: "", muscleGroupId: undefined })
    );

    customRenderUI(<ExercisesScreen />);

    // Wait for initial data to load
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data?.pages[0].data.length).toBe(10);
    });

    // Verify initial items
    const initialItems = screen.getAllByTestId(/exercise-item-\d+$/i);
    expect(initialItems.length).toBe(10);

    // Trigger next page fetch
    const list = screen.getByTestId("exercises-list");
    const { onEndReached } = list.props;

    await act(async () => {
      await onEndReached?.({ distanceFromEnd: 0 });
    });

    // Wait for second page to be fetched
    await waitFor(() => {
      expect(result.current.data?.pages.length).toBe(2);
      expect(result.current.data?.pages[1].data.length).toBe(10);
    });

    // Debug the data
    // console.log("Total pages:", result.current.data?.pages.length);
    // console.log("Page 1 items:", result.current.data?.pages[0].data.length);
    // console.log("Page 2 items:", result.current.data?.pages[1].data.length);
    // console.log(
    //   "All items:",
    //   result.current.data?.pages.flatMap((page: any) => page.data).length
    // );

    // Get all rendered items and their IDs
    const allItems = screen.getAllByTestId(/exercise-item-\d+$/i);
    // const renderedIds = allItems
    //   .map((item) => {
    //     const match = item.props.testID.match(/exercise-item-(\d+)$/);
    //     return match ? match[1] : null;
    //   })
    //   .filter(Boolean);

    // console.log("Rendered items:", allItems.length);
    // console.log("Rendered IDs:", renderedIds);

    // Get all expected IDs from both pages
    // const expectedIds = [
    //   ...exercisePage1.data.map((item) => item.id.toString()),
    //   ...exercisePage2.data.map((item) => item.id.toString()),
    // ];

    // console.log("Expected IDs:", expectedIds);
    // console.log(
    //   "Missing IDs:",
    //   expectedIds.filter((id) => !renderedIds.includes(id))
    // );k

    // Verify items from both pages are present
    const page1Item = exercisePage1.data[0].translations[0].name;
    const page2Item = exercisePage2.data[0].translations[0].name;

    expect(screen.getByText(page1Item, { exact: false })).toBeOnTheScreen();
    expect(screen.getByText(page2Item, { exact: false })).toBeOnTheScreen();

    // Final assertion
    expect(allItems.length).toBe(20);
  });

  it("should open and select muscle group from bottom sheet", async () => {
    // Mock initial data fetch
    nock(ENV.API_URL)
      .get(API_ROUTES.exercises.query({ page: 1 }))
      .reply(200, exercisePage1);

    const { result } = customRenderInfiniteQueryHook<Exercise[]>(() =>
      useGetExercises({ search: "", muscleGroupId: undefined })
    );

    customRenderUI(<ExercisesScreen />);

    // Wait for initial data to load
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Open muscle group bottom sheet
    const muscleGroupButton = screen.getByTestId("select-muscle-group-button");

    await act(async () => {
      fireEvent.press(muscleGroupButton);
    });

    // Wait for bottom sheet to be visible
    const bottomSheet = screen.getByTestId("select-muscle-group-sheet");
    await waitFor(() => {
      expect(bottomSheet).toBeOnTheScreen();
    });

    // Select a muscle group (e.g., "Ngực") in side select-muscle-group-sheet
    nock(ENV.API_URL)
      .get(API_ROUTES.exercises.query({ page: 1, muscleGroupId: 4 }))
      .reply(200, exercisesOfChestMuscleGroup);
    const chestButton = screen.getByTestId("muscle-item-4");
    await act(async () => {
      fireEvent.press(chestButton);
    });

    await waitFor(() => {
      const selectMuscleGroupButton = screen.getByTestId(
        "select-muscle-group-button"
      );
      // console.log("selectMuscleGroupButton ", selectMuscleGroupButton.child);
      const label = within(selectMuscleGroupButton).getByText("Ngực");
      expect(label).toBeOnTheScreen();

      for (const exercise of exercisesOfChestMuscleGroup.data) {
        expect(
          screen.getByText(exercise.translations[0].name, { exact: false })
        ).toBeOnTheScreen();
      }
      expect(screen.getAllByTestId(/exercise-item-\d+$/i).length).toBe(
        exercisesOfChestMuscleGroup.data.length
      );
    });
  });
});
