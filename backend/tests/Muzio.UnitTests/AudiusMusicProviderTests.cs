using System.Net;
using System.Text;
using Microsoft.Extensions.Configuration;
using Muzio.Infrastructure.Music;

namespace Muzio.UnitTests;

public class AudiusMusicProviderTests
{
    [Fact]
    public async Task GetTrending_MapsOnlyProviderAuthorizedPlaybackAndDownloads()
    {
        var handler = new StubHttpMessageHandler((request, _) =>
        {
            Assert.Equal(
                "https://api.audius.co/v1/tracks/trending?limit=10&app_name=MUZIO-Test",
                request.RequestUri?.ToString());

            const string response = """
                {
                  "data": [
                    {
                      "id": "playable",
                      "title": "Playable track",
                      "duration": 120,
                      "permalink": "/artist/playable-track",
                      "is_streamable": true,
                      "is_available": true,
                      "is_downloadable": true,
                      "is_stream_gated": false,
                      "license": "CC BY",
                      "artwork": { "480x480": "https://images.example/cover.jpg" },
                      "user": { "name": "Artist" },
                      "access": { "stream": true, "download": true }
                    },
                    {
                      "id": "metadata-only",
                      "title": "Metadata only",
                      "duration": 90,
                      "is_streamable": false,
                      "is_available": true,
                      "is_downloadable": true,
                      "is_stream_gated": false,
                      "user": { "name": "Another Artist" },
                      "access": { "stream": false, "download": false }
                    }
                  ]
                }
                """;

            return Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(response, Encoding.UTF8, "application/json")
            });
        });

        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Audius:AppName"] = "MUZIO-Test"
            })
            .Build();
        var provider = new AudiusMusicProvider(new HttpClient(handler), configuration);

        var tracks = await provider.GetTrendingAsync(10, CancellationToken.None);

        Assert.Equal(2, tracks.Count);
        Assert.True(tracks[0].IsPlayable);
        Assert.Equal("https://audius.co/artist/playable-track", tracks[0].ExternalUrl);
        Assert.Equal("https://api.audius.co/v1/tracks/playable/stream?app_name=MUZIO-Test", tracks[0].AudioStreamUrl);
        Assert.True(tracks[0].CanDownload);
        Assert.Equal("CC BY", tracks[0].LicenseInformation);
        Assert.False(tracks[1].IsPlayable);
        Assert.Null(tracks[1].ExternalUrl);
        Assert.False(tracks[1].CanDownload);
    }

    private sealed class StubHttpMessageHandler(
        Func<HttpRequestMessage, CancellationToken, Task<HttpResponseMessage>> sendAsync) : HttpMessageHandler
    {
        protected override Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request,
            CancellationToken cancellationToken) =>
            sendAsync(request, cancellationToken);
    }
}
