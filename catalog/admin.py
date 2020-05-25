from django.contrib import admin
from . models import Modems, Tree, Types, ValuesT1, Question

class QuestionAdmin(admin.ModelAdmin):
	pass

admin.site.register(Question, QuestionAdmin)
admin.site.register(Modems)
admin.site.register(Tree)
admin.site.register(Types)
admin.site.register(ValuesT1)
