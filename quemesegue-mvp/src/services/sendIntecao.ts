export default (data: any) => {
    return fetch("https://quem-me-segue-bff.azurewebsites.net/api/add-intencao?code=3emPgnZRJycub_gziN8g3jTvi-JaBGBDzjQ09c5ScdWDAzFuJ67PDA%3D%3D", {
        "method": "POST",
        "headers": {
            "Accept": "application/json, text/plain, */*",
            "Referer": "",
            "traceparent": "00-b01112ae16200f3c6b08e30c003f2d58-73e3700ae6a99942-01",
            "authorization": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJXcjZyVEcxOFBmZWF2ZW50WVlRUlFRYTNodDAxV0dFb1NsYVZoRHFfbkZRIn0.eyJleHAiOjE2NjE5Nzc0OTAsImlhdCI6MTY2MTk3NTY5MCwiYXV0aF90aW1lIjoxNjYxOTc1Njg5LCJqdGkiOiJhNTlhZDFmMy01M2JlLTQ0MWUtOWU1Yi05NDJmNWVjNmNhYjIiLCJpc3MiOiJodHRwczovL2lkLmRhc2EuY29tLmJyL2F1dGgvcmVhbG1zL0Z1bmNpb25hcmlvcyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiIyMzI2NmZkYS03OGMxLTRiYzYtOTkyNC1lMDBiMmRjM2Y2ZDAiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJiYW5kLWFpZCIsIm5vbmNlIjoiNzE4MGVjZDctMzdmNy00MmRjLTk2NzAtOTE5MDZmNDFmOGJhIiwic2Vzc2lvbl9zdGF0ZSI6IjQ4YzhlNDlkLTNmMDMtNDk4Mi1hZGViLTYzNDBiOTdiOTVmNyIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cHM6Ly9jYW5hbC1uYWMtYmZmLWhvc3BpdGFpcy5leHQtYXpyLXByZDAyLmRhc2FleHAuaW8vIiwiaHR0cDovL2NhbmFsLW5hYy1mcm9udC1ob3NwaXRhaXMuYXpyLXByZDAyLmRhc2FleHAuaW8vKiIsIicqJyIsImh0dHA6Ly9jYW5hbC1uYWMtYmZmLmF6ci1wcmQwMi5kYXNhZXhwLmlvIiwiaHR0cDovL2NhbmFsLW5hYy1mcm9udC5henItcHJkMDIuZGFzYWV4cC5pbyIsImh0dHBzOi8vY2FuYWxjb25zdWx0b3Job3NwaXRhaXMuZGFzYS5jb20uYnIiLCJodHRwOi8vY2FuYWwtbmFjLmF6ci1wcmQuZGFzYWV4cC5pbyIsImh0dHBzOi8vY2FuYWxkb2NvbnN1bHRvci5kYXNhLmNvbS5iciJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIGVtYWlsIHByb2ZpbGUiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsIm5hbWUiOiJKZWFubHVjYSBGZXJuYW5kZXMgUGVyZWlyYSBGZXJuYW5kZXMgUGVyZWlyYSIsInByZWZlcnJlZF91c2VybmFtZSI6InQwNTgzMzI1MTkwNyIsIm1lbWJlck9mIjpbIkdHX0JSX0FQTF9PRl9MU19GMyIsIkdHX0JSX0FQTF9DQVYwMl8gMDAxIiwiR0dfQlJfQVBMX1NFUlZJQ0VfTk9XX0RBX1JETV9ERVYiLCJHR19CUl9BUExfQUdEX05BQ19VU0VSIiwiR0dfQlJfQVBMX1NFUlZJQ0VfTk9XX0FCRVJUVVJBX01VREFOQ0EiLCJHR19CUl9BUExfQ1JJQVJfRU1BSUwiLCJHR19CUl9WUE5fVElfQ0hLUCIsIkdHX0JSX0FQTF9ERVZPUFMtVE9PTFMiLCJHR19CUl9BUExfU0VSVklDRV9OT1dfVVNFUlMiLCJHR19CUl9BUExfTUZBX01JQ1JPU09GVCJdLCJnaXZlbl9uYW1lIjoiSmVhbmx1Y2EgRmVybmFuZGVzIFBlcmVpcmEiLCJmYW1pbHlfbmFtZSI6IkZlcm5hbmRlcyBQZXJlaXJhIiwiZW1haWwiOiJqZWFubHVjYS5wZXJlaXJhLmV4dEBkYXNhLmNvbS5iciJ9.V_zQ27rz_IHTopxyyAnuo8bwXmWtgv2UJ11_QnL8E_4gksqUNp7Hs-nCWhxXWHTavOcd96FqaJYIH-wAlEh0wzc6105B1nFS9R5B1kaa5iqnPdV0DmLQmPs_3X0t0su0uiV4Jz_OfD8LpIXSTeL8givwijZjYD5e1E29ag_76N20koHrjPtP1iWqeaYW0cJXzBBRxBoIqR3gAMnlPF48C427qOpzCvR2fU9VbtgOs3hrgtRflh7btZ2_JLQRLL4P3yr6ReayXduBnUgByl8AOE2xbay2NEop1NuLeU3CvWOwvxVuwZ8JozmRk0OfMQN7vbZ3TGUpERn4PGRr7QMLsg",
            "Content-Type": "application/json"
        },
        "body": data
    })
        .then(response => {
            console.log(response);
        })
        .catch(err => {
            throw new Error(err)
        });
}