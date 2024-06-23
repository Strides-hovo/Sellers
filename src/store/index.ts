import {createStore } from 'vuex';
import {faker} from '@faker-js/faker';


enum Color {
    RED,
    GREEN,
    BLUE
}

export interface Seller {
    id: number;
    color: Color;
    name: string;
    sales: number;
    rating: number;
    avatar?: string;
}

interface State {
    sellers: Seller[];
    per_page: number;
}


const store = createStore<State>({
    state: () => ({
        sellers: [],
        per_page: 50
    }),
    mutations: {
        LOAD_SELLERS(state: any, seller: Seller) {
            state.sellers.push(seller);
        },
        SET_PER_PAGE(state: any, perpage: number) {
            state.per_page = perpage;
        }
    },
    actions: {
        load_sellers({commit}: any) {

            for (let i = 0; i < 1000; i++) {
                const name = faker.person.fullName()
                const sliceName = name.slice(0,15)
                const seller: Seller = {
                    id: i + 1,
                    color: faker.helpers.arrayElement([Color.RED, Color.BLUE, Color.GREEN]),
                    name: name.length > sliceName.length ? sliceName + ' ...' : name,
                    sales: faker.number.int({min: 0, max: 1000}),
                    rating: faker.number.float({min: 0, max: 5, multipleOf: 0.1}),
                    avatar: faker.image.avatarGitHub()
                };
                commit('LOAD_SELLERS', seller);
            }
        },
        set_per_page({commit}: any, perpage: number) {
            commit('SET_PER_PAGE', perpage);
        }
    },
    getters: {
        sellers: (state: any) => state.sellers,
        paginatedSellers: (state: any) => (page: number) => {
            const start = (page - 1) * state.per_page;
            const end = start + state.per_page
            const startPosByLimit = end < 100 ? 0 : end - 100

            return new Promise((resolve, reject) => {
                resolve(state.sellers.slice(startPosByLimit, end));
            });
        },
        totalPages: (state: any) => {
            return Math.ceil(state.sellers.length / state.per_page);
        }
    }
});

export default store
