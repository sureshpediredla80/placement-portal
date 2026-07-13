import { useEffect, useState } from "react";
import { getNews } from "../api/newsApi";

const useNews = (
    page,
    size
) => {

    const [news, setNews] =
        useState([]);

    const [loading, setLoading] =
        useState(false);



    const fetchNews =
        async () => {

            try {

                setLoading(true);

                const data =
                    await getNews(
                        page,
                        size
                    );

                setNews(
                    data.content
                );



            } catch (error) {

                console.error(
                    error
                );

            } finally {

                setLoading(false);

            }
        };

    useEffect(() => {

        fetchNews();

    }, [page, size]);

    return {
        news,
        loading,

        fetchNews,
    };
};

export default useNews;