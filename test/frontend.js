describe("index page", function(){
  it('renders markdown correctly', function(done){
    $('textarea').val('## heading')
    $('textarea').bind('keyup', function(){
      expect($.trim($('.right').html())).to.be.equal("<h2 id=\"heading\">heading</h2>")
      done()
    })

    $('textarea').trigger('keyup')
  });
});



