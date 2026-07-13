package com.college.placement.ratelimit;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class RateLimitService {

    private final Cache<String, Bucket> buckets =
            Caffeine.newBuilder()
                    .expireAfterAccess(Duration.ofMinutes(30))
                    .maximumSize(10000)
                    .build();

    public Bucket resolveBucket(
            String key,
            RateLimitType type
    ) {

        return buckets.get(
                key,
                k -> createBucket(type)
        );
    }

    private Bucket createBucket(
            RateLimitType type
    ) {

        Bandwidth limit;

        switch (type) {

            case LOGIN ->

                    limit = Bandwidth.builder()
                            .capacity(5)
                            .refillGreedy(
                                    5,
                                    Duration.ofMinutes(1)
                            )
                            .build();

            case REFRESH ->

                    limit = Bandwidth.builder()
                            .capacity(10)
                            .refillGreedy(
                                    10,
                                    Duration.ofMinutes(1)
                            )
                            .build();

            case FORGOT_PASSWORD ->

                    limit = Bandwidth.builder()
                            .capacity(5)
                            .refillGreedy(
                                    5,
                                    Duration.ofMinutes(10)
                            )
                            .build();

            case RESET_PASSWORD ->

                    limit = Bandwidth.builder()
                            .capacity(10)
                            .refillGreedy(
                                    10,
                                    Duration.ofMinutes(10)
                            )
                            .build();

            case READ ->

                    limit = Bandwidth.builder()
                            .capacity(200)
                            .refillGreedy(
                                    200,
                                    Duration.ofMinutes(1)
                            )
                            .build();

            case WRITE ->

                    limit = Bandwidth.builder()
                            .capacity(200)
                            .refillGreedy(
                                    200,
                                    Duration.ofMinutes(1)
                            )
                            .build();

            case UPDATE ->

                    limit = Bandwidth.builder()
                            .capacity(80)
                            .refillGreedy(
                                    80,
                                    Duration.ofMinutes(1)
                            )
                            .build();

            case DELETE ->

                    limit = Bandwidth.builder()
                            .capacity(10)
                            .refillGreedy(
                                    5,
                                    Duration.ofMinutes(1)
                            )
                            .build();

            case SEARCH ->

                    limit = Bandwidth.builder()
                            .capacity(60)
                            .refillGreedy(
                                    60,
                                    Duration.ofMinutes(1)
                            )
                            .build();

            case APPLY ->

                    limit = Bandwidth.builder()
                            .capacity(200)
                            .refillGreedy(
                                    200,
                                    Duration.ofMinutes(1)
                            )
                            .build();

            case UPLOAD ->

                    limit = Bandwidth.builder()
                            .capacity(100)
                            .refillGreedy(
                                    100,
                                    Duration.ofMinutes(1)
                            )
                            .build();

            case ADMIN ->

                    limit = Bandwidth.builder()
                            .capacity(500)
                            .refillGreedy(
                                    500,
                                    Duration.ofMinutes(1)
                            )
                            .build();

            default ->

                    throw new IllegalArgumentException(
                            "Unknown RateLimitType : " + type);

        }

        return Bucket.builder()
                .addLimit(limit)
                .build();
    }
}