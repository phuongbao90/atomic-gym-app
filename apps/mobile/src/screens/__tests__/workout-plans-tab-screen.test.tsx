import { useGetWorkoutPlansInGroups, WorkoutPlanInGroups } from "app";
import { customRenderUI, customRenderQueryHook } from "../../utils/test-utils";
import { WorkoutPlansTabScreen } from "../workout-plans/workout-plans-tab-screen";
import nock from "nock";
import { ENV, API_ROUTES } from "app";
import { fireEvent, waitFor } from "@testing-library/react-native";
import { useRouter } from "../../../__mocks__/expo-router";
import { appRoutes } from "../../configs/routes";

const mockData: WorkoutPlanInGroups = {
  byCategory: [
    {
      result: {
        name: "STRENGTH",
        data: [
          {
            id: 7,
            category: "STRENGTH",
            isFeatured: false,
            cover_image:
              "https://loremflickr.com/2145/2109?lock=2014195898218396",
            level: "ADVANCED",
            isPremium: false,
            name: "Thế yêu phá nghỉ.",
            description:
              "Đập việc thuê tôi là đập vàng bơi chìm. Độc đang chết tủ độc hết hai đánh chìm trăng. Lỗi nước dép xanh vàng hàng mười xanh.",
            slug: "the-yeu-pha-nghi",
            _count: {
              workouts: 0,
            },
          },
          {
            id: 28,
            category: "STRENGTH",
            isFeatured: false,
            cover_image: "https://picsum.photos/seed/a2Nrszi/3426/811",
            level: "INTERMEDIATE",
            isPremium: true,
            name: "Ghét giết đâu nha may con vẽ bè đã nghỉ.",
            description:
              "Biết mười chết máy vá tủ leo bàn mười kim. Vá tô trời lầu ác ruộng. Được nhà ruộng leo con mua.",
            slug: "ghet-giet-dau-nha-may-con-ve-be-da-nghi",
            _count: {
              workouts: 3,
            },
          },
          {
            id: 3,
            category: "STRENGTH",
            isFeatured: false,
            cover_image: "https://picsum.photos/seed/eyjiUnye/2883/741",
            level: "ADVANCED",
            isPremium: true,
            name: "Hết tô may tím bơi thế.",
            description:
              "Hóa chết đá quê may khâu. Làm đồng bàn đã quê dép ác yêu quê thích. Biết núi hương đập ba ghế là.",
            slug: "het-to-may-tim-boi-the",
            _count: {
              workouts: 0,
            },
          },
        ],
      },
    },
    {
      result: {
        name: "ENDURANCE",
        data: [
          {
            id: 41,
            category: "ENDURANCE",
            isFeatured: false,
            cover_image:
              "https://loremflickr.com/3209/1439?lock=7490789273670447",
            level: "BEGINNER",
            isPremium: false,
            name: "Kim chìm thuyền vá máy máy.",
            description:
              "Bảy tôi mười ghét tôi mua. Chìm ba thôi việc đồng chìm hàng bàn mây. Thuê độc biển mượn anh.",
            slug: "kim-chim-thuyen-va-may-may",
            _count: {
              workouts: 1,
            },
          },
          {
            id: 49,
            category: "ENDURANCE",
            isFeatured: false,
            cover_image:
              "https://loremflickr.com/3903/1838?lock=7659617768075078",
            level: "ADVANCED",
            isPremium: true,
            name: "Ừ việc xe thích quê vẽ bàn dép tui nón.",
            description:
              "Biển đánh nước tô tám tô thuyền. Khâu em ba phá thế thương. Mây chỉ thì dép kim đỏ.",
            slug: "u-viec-xe-thich-que-ve-ban-dep-tui-non",
            _count: {
              workouts: 1,
            },
          },
          {
            id: 43,
            category: "ENDURANCE",
            isFeatured: false,
            cover_image: "https://picsum.photos/seed/8gm80xPy/3732/1783",
            level: "INTERMEDIATE",
            isPremium: false,
            name: "Đồng là ghế hàng bốn xanh kim.",
            description:
              "Kim bảy hàng thế leo mười. Nha thôi hết yêu hai thuê tui. Mười máy viết hương đánh mây anh bè thích mướn.",
            slug: "dong-la-ghe-hang-bon-xanh-kim",
            _count: {
              workouts: 0,
            },
          },
          {
            id: 6,
            category: "ENDURANCE",
            isFeatured: false,
            cover_image:
              "https://loremflickr.com/2473/2597?lock=1948913974194706",
            level: "INTERMEDIATE",
            isPremium: true,
            name: "Quần dép hương vàng.",
            description:
              "Quê ác viết ngọt tủ đỏ tám. Chết tàu ruộng phá ừ leo tô quê. Biển tám bơi một đánh khoảng hết tô lỗi bơi.",
            slug: "quan-dep-huong-vang",
            _count: {
              workouts: 0,
            },
          },
        ],
      },
    },
    {
      result: {
        name: "BALANCE",
        data: [
          {
            id: 50,
            category: "BALANCE",
            isFeatured: false,
            cover_image: "https://picsum.photos/seed/aHXmwKq45/3308/1434",
            level: "ADVANCED",
            isPremium: true,
            name: "Không chết biển việc á ghét năm làm.",
            description:
              "Thuê ừ viết máy á tủ được mây áo tủ. Trăng đập leo tô cái quê mua bảy. Hai nước ghế làm.",
            slug: "khong-chet-bien-viec-a-ghet-nam-lam",
            _count: {
              workouts: 0,
            },
          },
          {
            id: 18,
            category: "BALANCE",
            isFeatured: false,
            cover_image:
              "https://loremflickr.com/3285/1571?lock=6277997179979623",
            level: "BEGINNER",
            isPremium: true,
            name: "Kim đâu khoan.",
            description:
              "Á bạn đánh áo chìm. Thôi chết tô năm giết. Nghỉ lầu khoan khoan thôi.",
            slug: "kim-dau-khoan",
            _count: {
              workouts: 2,
            },
          },
          {
            id: 40,
            category: "BALANCE",
            isFeatured: false,
            cover_image:
              "https://loremflickr.com/515/2964?lock=3459480043930231",
            level: "INTERMEDIATE",
            isPremium: false,
            name: "Ghế tím gió lầu thế thương gì.",
            description:
              "Không yêu đạp hương bạn được xanh thế hai. Tôi trăng may yêu thích núi hương kim. Xuồng á xanh tàu khoảng tô tám.",
            slug: "ghe-tim-gio-lau-the-thuong-gi",
            _count: {
              workouts: 3,
            },
          },
        ],
      },
    },
    {
      result: {
        name: "FLEXIBILITY",
        data: [
          {
            id: 11,
            category: "FLEXIBILITY",
            isFeatured: false,
            cover_image:
              "https://loremflickr.com/454/1569?lock=8629010328965560",
            level: "BEGINNER",
            isPremium: true,
            name: "Tàu việc thích.",
            description:
              "Thì giết bàn đồng mua năm. Đạp bạn lầu. Tám ờ tám không con nhà trời em.",
            slug: "tau-viec-thich",
            _count: {
              workouts: 0,
            },
          },
          {
            id: 48,
            category: "FLEXIBILITY",
            isFeatured: false,
            cover_image: "https://picsum.photos/seed/QCPWX/1748/2004",
            level: "INTERMEDIATE",
            isPremium: true,
            name: "Gì trời giết.",
            description:
              "Nước tô đã. Ba sáu quê núi kim ghế biết. Phá hết lỗi tím xuồng đập.",
            slug: "gi-troi-giet",
            _count: {
              workouts: 1,
            },
          },
          {
            id: 35,
            category: "FLEXIBILITY",
            isFeatured: false,
            cover_image: "https://picsum.photos/seed/dZe2GZ/2762/1995",
            level: "ADVANCED",
            isPremium: false,
            name: "Tủ hết tím.",
            description:
              "Đập vá khoan núi dép đã chỉ bơi tám một. Đã ba tô khâu yêu tôi tàu xe. Bàn hương chìm tủ thuê.",
            slug: "tu-het-tim",
            _count: {
              workouts: 0,
            },
          },
          {
            id: 34,
            category: "FLEXIBILITY",
            isFeatured: false,
            cover_image: "https://picsum.photos/seed/4p1IY/2329/3062",
            level: "ADVANCED",
            isPremium: true,
            name: "Năm làm mây biết vàng năm đánh tím quần tàu.",
            description:
              "Á bảy máy. Khoảng ác tàu mua may leo. Áo bốn tui không yêu máy.",
            slug: "nam-lam-may-biet-vang-nam-danh-tim-quan-tau",
            _count: {
              workouts: 2,
            },
          },
        ],
      },
    },
    {
      result: {
        name: "LOOSE_WEIGHT",
        data: [
          {
            id: 8,
            category: "LOOSE_WEIGHT",
            isFeatured: false,
            cover_image:
              "https://loremflickr.com/3104/3867?lock=6574577170361165",
            level: "ADVANCED",
            isPremium: false,
            name: "Không ghế ghét nước năm khâu tím đâu thế.",
            description:
              "Thế thuyền ruộng nón năm leo bè núi đá ghét. Dép thích bốn khoảng thương vá trời vàng là năm. Đồng chìm năm giết.",
            slug: "khong-ghe-ghet-nuoc-nam-khau-tim-dau-the",
            _count: {
              workouts: 0,
            },
          },
          {
            id: 31,
            category: "LOOSE_WEIGHT",
            isFeatured: false,
            cover_image: "https://picsum.photos/seed/jKoTqdn/2020/3443",
            level: "BEGINNER",
            isPremium: true,
            name: "Đã á xe sáu quê đập tôi.",
            description:
              "Trời dép hai ngọt nghỉ thế phá bạn. Làm con một giết bốn chìm khoảng mướn tàu. Là đang dép lỗi áo trời xuồng vàng trăng.",
            slug: "da-a-xe-sau-que-dap-toi",
            _count: {
              workouts: 1,
            },
          },
          {
            id: 37,
            category: "LOOSE_WEIGHT",
            isFeatured: false,
            cover_image: "https://picsum.photos/seed/B6KEc/1208/2413",
            level: "ADVANCED",
            isPremium: false,
            name: "Hàng đập cửa hàng áo tủ.",
            description:
              "Việc hóa vàng tủ cái leo giày trời. Thương á khâu là mười xuồng gió lỗi chỉ ừ. Máy khoảng là mây biển bảy đỏ.",
            slug: "hang-dap-cua-hang-ao-tu",
            _count: {
              workouts: 1,
            },
          },
          {
            id: 5,
            category: "LOOSE_WEIGHT",
            isFeatured: false,
            cover_image: "https://picsum.photos/seed/xU9hpqG/3072/3272",
            level: "INTERMEDIATE",
            isPremium: true,
            name: "Được lỗi cửa bảy bàn tủ việc xanh hương đồng.",
            description:
              "Đâu phá khoan trời ghế dép. Anh hàng tôi đâu làm hết ghét gió ngọt. Đồng nón đỏ tàu vá yêu.",
            slug: "duoc-loi-cua-bay-ban-tu-viec-xanh-huong-dong",
            _count: {
              workouts: 1,
            },
          },
          {
            id: 19,
            category: "LOOSE_WEIGHT",
            isFeatured: false,
            cover_image:
              "https://loremflickr.com/1720/1881?lock=6821239303074428",
            level: "INTERMEDIATE",
            isPremium: true,
            name: "Tôi á tủ em đỏ đã một thích.",
            description:
              "Tô giày thuyền. Đâu máy tô bốn thuê hương bốn nha. Bơi thuyền máy chìm bốn may.",
            slug: "toi-a-tu-em-do-da-mot-thich",
            _count: {
              workouts: 2,
            },
          },
        ],
      },
    },
  ],
  isFeatured: [
    {
      id: 1,
      cover_image: "https://loremflickr.com/2072/1446?lock=6744946607046901",
      level: "ADVANCED",
      isPublic: true,
      isPremium: false,
      isFeatured: true,
      isSingle: false,
      category: "LOOSE_WEIGHT",
      createdById: 7,
      createdAt: "2025-04-09T11:30:03.356Z",
      updatedAt: "2025-04-09T11:30:03.356Z",
      _count: {
        workouts: 0,
      },
      translations: [
        {
          workoutPlanId: 1,
          language: "vi",
          name: "Nón thương hàng xuồng ghét ba.",
          description:
            "Bốn độc đập kim. Tui nhà tàu thôi đang khâu vá. Tám áo đập mây.",
          slug: "non-thuong-hang-xuong-ghet-ba",
        },
      ],
    },
    {
      id: 2,
      cover_image: "https://loremflickr.com/1922/787?lock=5211221766443481",
      level: "BEGINNER",
      isPublic: true,
      isPremium: false,
      isFeatured: true,
      isSingle: true,
      category: "ENDURANCE",
      createdById: 12,
      createdAt: "2025-04-09T11:30:03.360Z",
      updatedAt: "2025-04-09T11:30:03.360Z",
      _count: {
        workouts: 1,
      },
      translations: [
        {
          workoutPlanId: 2,
          language: "vi",
          name: "Trời lầu ghét ờ dép leo cái nha.",
          description:
            "Hàng áo làm bốn đập áo. Chỉ tám lầu giày bàn là vẽ biết nhà. Mượn là nha nước.",
          slug: "troi-lau-ghet-o-dep-leo-cai-nha",
        },
      ],
    },
    {
      id: 4,
      cover_image: "https://picsum.photos/seed/EVmL7/2443/3698",
      level: "INTERMEDIATE",
      isPublic: true,
      isPremium: true,
      isFeatured: true,
      isSingle: false,
      category: "ENDURANCE",
      createdById: 12,
      createdAt: "2025-04-09T11:30:03.364Z",
      updatedAt: "2025-04-09T11:30:03.364Z",
      _count: {
        workouts: 2,
      },
      translations: [
        {
          workoutPlanId: 4,
          language: "vi",
          name: "Sáu nha á tui tím núi hai.",
          description:
            "Đập hương hết đá đánh gì thôi. Yêu gì vàng thế được. Bàn mượn bạn.",
          slug: "sau-nha-a-tui-tim-nui-hai",
        },
      ],
    },
    {
      id: 9,
      cover_image: "https://picsum.photos/seed/zvSnkX/506/517",
      level: "INTERMEDIATE",
      isPublic: true,
      isPremium: false,
      isFeatured: true,
      isSingle: false,
      category: "ENDURANCE",
      createdById: 9,
      createdAt: "2025-04-09T11:30:03.373Z",
      updatedAt: "2025-04-09T11:30:03.373Z",
      _count: {
        workouts: 0,
      },
      translations: [
        {
          workoutPlanId: 9,
          language: "vi",
          name: "Ngọt quê tám kim.",
          description:
            "Viết đỏ ngọt tôi đánh cái làm được. Hương việc ruộng năm chín. Ghế cái không ruộng quê tui.",
          slug: "ngot-que-tam-kim",
        },
      ],
    },
    {
      id: 10,
      cover_image: "https://loremflickr.com/1501/3951?lock=779706960734775",
      level: "ADVANCED",
      isPublic: false,
      isPremium: false,
      isFeatured: true,
      isSingle: false,
      category: "ENDURANCE",
      createdById: 13,
      createdAt: "2025-04-09T11:30:03.375Z",
      updatedAt: "2025-04-09T11:30:03.375Z",
      _count: {
        workouts: 1,
      },
      translations: [
        {
          workoutPlanId: 10,
          language: "vi",
          name: "Nước mượn sáu hàng.",
          description:
            "Khâu chỉ bè không vẽ. Độc chỉ chìm gió. Viết nghỉ tám là á thuê áo bạn quê ừ.",
          slug: "nuoc-muon-sau-hang",
        },
      ],
    },
    {
      id: 12,
      cover_image: "https://loremflickr.com/2943/3455?lock=2652118394566235",
      level: "ADVANCED",
      isPublic: false,
      isPremium: true,
      isFeatured: true,
      isSingle: false,
      category: "STRENGTH",
      createdById: 7,
      createdAt: "2025-04-09T11:30:03.378Z",
      updatedAt: "2025-04-09T11:30:03.378Z",
      _count: {
        workouts: 0,
      },
      translations: [
        {
          workoutPlanId: 12,
          language: "vi",
          name: "Lỗi gió đạp mua đập viết bơi.",
          description:
            "Leo thôi đạp ba bàn xuồng quê mượn. Biển mây việc ghế nước hàng đã biển. Hết xanh trăng tàu năm khoan việc.",
          slug: "loi-gio-dap-mua-dap-viet-boi",
        },
      ],
    },
  ],
  single: [
    {
      id: 3,
      cover_image: "https://picsum.photos/seed/eyjiUnye/2883/741",
      level: "ADVANCED",
      isPublic: true,
      isPremium: true,
      isFeatured: false,
      isSingle: true,
      category: "STRENGTH",
      createdById: 10,
      createdAt: "2025-04-09T11:30:03.362Z",
      updatedAt: "2025-04-09T11:30:03.362Z",
      translations: [
        {
          workoutPlanId: 3,
          language: "vi",
          name: "Hết tô may tím bơi thế.",
          description:
            "Hóa chết đá quê may khâu. Làm đồng bàn đã quê dép ác yêu quê thích. Biết núi hương đập ba ghế là.",
          slug: "het-to-may-tim-boi-the",
        },
      ],
    },
    {
      id: 6,
      cover_image: "https://loremflickr.com/2473/2597?lock=1948913974194706",
      level: "INTERMEDIATE",
      isPublic: false,
      isPremium: true,
      isFeatured: false,
      isSingle: true,
      category: "ENDURANCE",
      createdById: 15,
      createdAt: "2025-04-09T11:30:03.368Z",
      updatedAt: "2025-04-09T11:30:03.368Z",
      translations: [
        {
          workoutPlanId: 6,
          language: "vi",
          name: "Quần dép hương vàng.",
          description:
            "Quê ác viết ngọt tủ đỏ tám. Chết tàu ruộng phá ừ leo tô quê. Biển tám bơi một đánh khoảng hết tô lỗi bơi.",
          slug: "quan-dep-huong-vang",
        },
      ],
    },
    {
      id: 31,
      cover_image: "https://picsum.photos/seed/jKoTqdn/2020/3443",
      level: "BEGINNER",
      isPublic: true,
      isPremium: true,
      isFeatured: false,
      isSingle: true,
      category: "LOOSE_WEIGHT",
      createdById: 14,
      createdAt: "2025-04-09T11:30:03.414Z",
      updatedAt: "2025-04-09T11:30:03.414Z",
      translations: [
        {
          workoutPlanId: 31,
          language: "vi",
          name: "Đã á xe sáu quê đập tôi.",
          description:
            "Trời dép hai ngọt nghỉ thế phá bạn. Làm con một giết bốn chìm khoảng mướn tàu. Là đang dép lỗi áo trời xuồng vàng trăng.",
          slug: "da-a-xe-sau-que-dap-toi",
        },
      ],
    },
    {
      id: 37,
      cover_image: "https://picsum.photos/seed/B6KEc/1208/2413",
      level: "ADVANCED",
      isPublic: false,
      isPremium: false,
      isFeatured: false,
      isSingle: true,
      category: "LOOSE_WEIGHT",
      createdById: 3,
      createdAt: "2025-04-09T11:30:03.424Z",
      updatedAt: "2025-04-09T11:30:03.424Z",
      translations: [
        {
          workoutPlanId: 37,
          language: "vi",
          name: "Hàng đập cửa hàng áo tủ.",
          description:
            "Việc hóa vàng tủ cái leo giày trời. Thương á khâu là mười xuồng gió lỗi chỉ ừ. Máy khoảng là mây biển bảy đỏ.",
          slug: "hang-dap-cua-hang-ao-tu",
        },
      ],
    },
    {
      id: 40,
      cover_image: "https://loremflickr.com/515/2964?lock=3459480043930231",
      level: "INTERMEDIATE",
      isPublic: true,
      isPremium: false,
      isFeatured: false,
      isSingle: true,
      category: "BALANCE",
      createdById: 12,
      createdAt: "2025-04-09T11:30:03.429Z",
      updatedAt: "2025-04-09T11:30:03.429Z",
      translations: [
        {
          workoutPlanId: 40,
          language: "vi",
          name: "Ghế tím gió lầu thế thương gì.",
          description:
            "Không yêu đạp hương bạn được xanh thế hai. Tôi trăng may yêu thích núi hương kim. Xuồng á xanh tàu khoảng tô tám.",
          slug: "ghe-tim-gio-lau-the-thuong-gi",
        },
      ],
    },
    {
      id: 41,
      cover_image: "https://loremflickr.com/3209/1439?lock=7490789273670447",
      level: "BEGINNER",
      isPublic: false,
      isPremium: false,
      isFeatured: false,
      isSingle: true,
      category: "ENDURANCE",
      createdById: 6,
      createdAt: "2025-04-09T11:30:03.431Z",
      updatedAt: "2025-04-09T11:30:03.431Z",
      translations: [
        {
          workoutPlanId: 41,
          language: "vi",
          name: "Kim chìm thuyền vá máy máy.",
          description:
            "Bảy tôi mười ghét tôi mua. Chìm ba thôi việc đồng chìm hàng bàn mây. Thuê độc biển mượn anh.",
          slug: "kim-chim-thuyen-va-may-may",
        },
      ],
    },
    {
      id: 43,
      cover_image: "https://picsum.photos/seed/8gm80xPy/3732/1783",
      level: "INTERMEDIATE",
      isPublic: true,
      isPremium: false,
      isFeatured: false,
      isSingle: true,
      category: "ENDURANCE",
      createdById: 12,
      createdAt: "2025-04-09T11:30:03.435Z",
      updatedAt: "2025-04-09T11:30:03.435Z",
      translations: [
        {
          workoutPlanId: 43,
          language: "vi",
          name: "Đồng là ghế hàng bốn xanh kim.",
          description:
            "Kim bảy hàng thế leo mười. Nha thôi hết yêu hai thuê tui. Mười máy viết hương đánh mây anh bè thích mướn.",
          slug: "dong-la-ghe-hang-bon-xanh-kim",
        },
      ],
    },
    {
      id: 48,
      cover_image: "https://picsum.photos/seed/QCPWX/1748/2004",
      level: "INTERMEDIATE",
      isPublic: false,
      isPremium: true,
      isFeatured: false,
      isSingle: true,
      category: "FLEXIBILITY",
      createdById: 5,
      createdAt: "2025-04-09T11:30:03.445Z",
      updatedAt: "2025-04-09T11:30:03.445Z",
      translations: [
        {
          workoutPlanId: 48,
          language: "vi",
          name: "Gì trời giết.",
          description:
            "Nước tô đã. Ba sáu quê núi kim ghế biết. Phá hết lỗi tím xuồng đập.",
          slug: "gi-troi-giet",
        },
      ],
    },
    {
      id: 49,
      cover_image: "https://loremflickr.com/3903/1838?lock=7659617768075078",
      level: "ADVANCED",
      isPublic: false,
      isPremium: true,
      isFeatured: false,
      isSingle: true,
      category: "ENDURANCE",
      createdById: 8,
      createdAt: "2025-04-09T11:30:03.446Z",
      updatedAt: "2025-04-09T11:30:03.446Z",
      translations: [
        {
          workoutPlanId: 49,
          language: "vi",
          name: "Ừ việc xe thích quê vẽ bàn dép tui nón.",
          description:
            "Biển đánh nước tô tám tô thuyền. Khâu em ba phá thế thương. Mây chỉ thì dép kim đỏ.",
          slug: "u-viec-xe-thich-que-ve-ban-dep-tui-non",
        },
      ],
    },
    {
      id: 50,
      cover_image: "https://picsum.photos/seed/aHXmwKq45/3308/1434",
      level: "ADVANCED",
      isPublic: true,
      isPremium: true,
      isFeatured: false,
      isSingle: true,
      category: "BALANCE",
      createdById: 13,
      createdAt: "2025-04-09T11:30:03.449Z",
      updatedAt: "2025-04-09T11:30:03.449Z",
      translations: [
        {
          workoutPlanId: 50,
          language: "vi",
          name: "Không chết biển việc á ghét năm làm.",
          description:
            "Thuê ừ viết máy á tủ được mây áo tủ. Trăng đập leo tô cái quê mua bảy. Hai nước ghế làm.",
          slug: "khong-chet-bien-viec-a-ghet-nam-lam",
        },
      ],
    },
  ],
};

describe("WorkoutPlansTabScreen", () => {
  it("should render correctly", async () => {
    nock(ENV.API_URL).get(API_ROUTES.plans.inGroups).reply(200, {
      data: mockData,
    });
    const { result } = customRenderQueryHook(() =>
      useGetWorkoutPlansInGroups()
    );
    const { getByTestId, getByText, getAllByTestId } = customRenderUI(
      <WorkoutPlansTabScreen />
    );

    expect(result.current.isSuccess).toEqual(false);
    expect(result.current.isLoading).toEqual(true);
    expect(result.current.isError).toEqual(false);
    expect(result.current.data).toEqual(undefined);

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData);
      expect(result.current.isSuccess).toEqual(true);
      expect(result.current.isLoading).toEqual(false);
      expect(result.current.isError).toEqual(false);
    });

    expect(getByText(/giáo án luyện tập/i)).toBeTruthy();
    expect(getByText(/đề xuất/i)).toBeTruthy();
    expect(getByText(/sức mạnh/i)).toBeTruthy();
    expect(getByText(/độ bền/i)).toBeTruthy();
    expect(getByText(/cân bằng/i)).toBeTruthy();
    expect(getByText(/linh hoạt/i)).toBeTruthy();
    expect(getByText(/giảm cân/i)).toBeTruthy();
    expect(getByText(/giáo án đơn/i)).toBeTruthy();
    expect(getByText(/^bài tập$/i)).toBeTruthy();

    fireEvent.press(getByTestId("view-all-exercises-button"));
    expect(useRouter().push).toHaveBeenCalledWith(appRoutes.exercises.list());

    fireEvent.press(getByTestId("build-plan-button"));
    expect(useRouter().navigate).toHaveBeenCalledWith(
      appRoutes.workoutPlans.create()
    );

    expect(getAllByTestId(/^single-workout-plan-card$/i).length).toEqual(
      mockData.single.length
    );

    const categoryLength = mockData.byCategory.reduce((acc, curr) => {
      return acc + curr.result.data.length;
    }, 0);

    expect(getAllByTestId(/^workout-plan-card$/i).length).toEqual(
      mockData.isFeatured.length + categoryLength
    );

    const firstPlanCard = getAllByTestId(/^workout-plan-card/i)[0];

    fireEvent.press(firstPlanCard);
    expect(useRouter().push).toHaveBeenCalledWith(
      appRoutes.workoutPlans.detail(mockData.isFeatured[0].id.toString())
    );

    const firstSinglePlanCard = getAllByTestId(/^single-workout-plan-card/i)[0];
    fireEvent.press(firstSinglePlanCard);
    expect(useRouter().push).toHaveBeenCalledWith(
      appRoutes.workouts.detail(mockData.single[0].id.toString())
    );
  });
});
