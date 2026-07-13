package com.college.placement.ratelimit;

import com.college.placement.security.UserPrincipal;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class ClientIdentifier {

    public String getClientKey(HttpServletRequest request) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication != null
                && authentication.isAuthenticated()
                && authentication.getPrincipal() instanceof UserPrincipal userPrincipal)
        {

            return "USER_" + userPrincipal.getId();
        }

        return "ANON_" + request.getRemoteAddr();
    }
    public Long getUserId(HttpServletRequest request) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication != null
                && authentication.getPrincipal() instanceof UserPrincipal userPrincipal) {

            return userPrincipal.getId();
        }

        return null;
    }
    public String getIpAddress(HttpServletRequest request) {

        return request.getRemoteAddr();
    }
}